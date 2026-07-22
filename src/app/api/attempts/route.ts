import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { attempts, trainingSessions, userProfiles, userProgress } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";
import { submitAttemptSchema } from "@/lib/validators/attempts";
import { transcribeAudioFromBrowserTranscript } from "@/lib/ai/transcription";
import { extractSpeechMetrics } from "@/lib/ai/metrics";
import { analyzeSpeech } from "@/lib/ai/speech-analysis";
import { storeAudioDataUrl } from "@/lib/services/audio-storage";
import { trackEvent } from "@/lib/analytics/events";
import { demoSessionId, demoUserId } from "@/lib/demo/data";

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const input = submitAttemptSchema.parse(await request.json());
    if (session.userId === demoUserId) {
      const transcript = await transcribeAudioFromBrowserTranscript(input.transcript);
      const metrics = extractSpeechMetrics(transcript, input.durationSeconds);
      const analysis = await analyzeSpeech("challenge_60", transcript, input.durationSeconds);
      const demoAttempt = {
        id: `demo-attempt-${input.attemptNumber}`,
        trainingSessionId: demoSessionId,
        userId: demoUserId,
        attemptNumber: input.attemptNumber,
        durationSeconds: input.durationSeconds,
        transcript,
        wordCount: metrics.wordCount,
        wordsPerMinute: metrics.wordsPerMinute,
        overallScore: analysis.nota_geral,
        analysisJson: analysis
      };
      return NextResponse.json({ ok: true, attempt: demoAttempt, attempts: [demoAttempt] });
    }

    const [training] = await db.select().from(trainingSessions).where(and(
      eq(trainingSessions.id, input.sessionId),
      eq(trainingSessions.userId, session.userId),
      eq(trainingSessions.isDeleted, false)
    )).limit(1);
    if (!training) throw new Error("Sessao nao encontrada");

    const transcript = await transcribeAudioFromBrowserTranscript(input.transcript);
    const metrics = extractSpeechMetrics(transcript, input.durationSeconds);
    const analysis = await analyzeSpeech(training.type, transcript, input.durationSeconds);
    const audioUrl = await storeAudioDataUrl(session.userId, input.audioDataUrl);

    const [created] = await db.insert(attempts).values({
      trainingSessionId: training.id,
      userId: session.userId,
      attemptNumber: input.attemptNumber,
      audioUrl,
      durationSeconds: input.durationSeconds,
      transcript,
      wordCount: metrics.wordCount,
      wordsPerMinute: metrics.wordsPerMinute,
      overallScore: analysis.nota_geral,
      analysisJson: analysis,
      modifiedBy: session.userId
    }).returning();

    await db.update(trainingSessions).set({
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
      modifiedBy: session.userId
    }).where(eq(trainingSessions.id, training.id));

    const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, session.userId)).limit(1);
    await db.update(userProgress).set({
      totalTrainings: (progress?.totalTrainings ?? 0) + (input.attemptNumber === 1 ? 1 : 0),
      streakDays: Math.max(1, progress?.streakDays ?? 0),
      bestScore: Math.max(progress?.bestScore ?? 0, analysis.nota_geral),
      lastTrainingDate: new Date(),
      clarityScore: analysis.clareza,
      objectivityScore: analysis.objetividade,
      structureScore: analysis.estrutura,
      persuasionScore: analysis.persuasao,
      perceivedConfidenceScore: analysis.confianca_percebida,
      updatedAt: new Date(),
      modifiedBy: session.userId
    }).where(eq(userProgress.userId, session.userId));

    await db.update(userProfiles).set({
      currentScore: analysis.nota_geral,
      currentProfileName: analysis.nota_geral >= 80 ? "Comunicador consistente" : analysis.nota_geral >= 65 ? "Comunicador em evolucao" : "Comunicador em construcao",
      updatedAt: new Date(),
      modifiedBy: session.userId
    }).where(eq(userProfiles.userId, session.userId));

    const doneEvent = training.type === "diagnostic" ? "diagnostico_concluido" : training.type === "daily" ? "treino_diario_concluido" : input.attemptNumber === 1 ? "primeira_tentativa_concluida" : "segunda_tentativa_concluida";
    await trackEvent(session.userId, doneEvent, { sessionId: training.id, attemptId: created.id });

    const previous = await db.select().from(attempts).where(and(eq(attempts.trainingSessionId, training.id), eq(attempts.isDeleted, false))).orderBy(desc(attempts.attemptNumber));
    return NextResponse.json({ ok: true, attempt: created, attempts: previous });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Falha ao analisar tentativa" }, { status: 400 });
  }
}
