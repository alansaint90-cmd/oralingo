import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { attempts, challenges, trainingSessions, userProfiles, userProgress, users } from "@/lib/db/schema";
import { demoAnalysis, demoChallenge60, demoImprovedAnalysis, demoProfile, demoProgress, demoSessionId, demoUser, demoUserId } from "@/lib/demo/data";

export async function getDashboardData(userId: string) {
  if (userId === demoUserId) {
    return { user: demoUser, profile: demoProfile, progress: demoProgress };
  }

  const [user] = await db.select().from(users).where(and(eq(users.id, userId), eq(users.isDeleted, false))).limit(1);
  const [profile] = await db.select().from(userProfiles).where(and(eq(userProfiles.userId, userId), eq(userProfiles.isDeleted, false))).limit(1);
  const [progress] = await db.select().from(userProgress).where(and(eq(userProgress.userId, userId), eq(userProgress.isDeleted, false))).limit(1);
  return { user, profile, progress };
}

export async function getSessionResult(userId: string, sessionId: string) {
  if (userId === demoUserId) {
    return {
      session: { id: demoSessionId, type: "challenge_60", challengeId: demoChallenge60.id },
      challenge: demoChallenge60,
      attempts: [
        {
          id: "demo-attempt-1",
          attemptNumber: 1,
          wordCount: 118,
          wordsPerMinute: 132,
          overallScore: demoAnalysis.nota_geral,
          analysisJson: demoAnalysis
        },
        ...(sessionId.includes("comparison") ? [{
          id: "demo-attempt-2",
          attemptNumber: 2,
          wordCount: 126,
          wordsPerMinute: 140,
          overallScore: demoImprovedAnalysis.nota_geral,
          analysisJson: demoImprovedAnalysis
        }] : [])
      ]
    };
  }

  const [session] = await db.select().from(trainingSessions).where(and(eq(trainingSessions.id, sessionId), eq(trainingSessions.userId, userId), eq(trainingSessions.isDeleted, false))).limit(1);
  if (!session) return null;
  const [challenge] = await db.select().from(challenges).where(eq(challenges.id, session.challengeId)).limit(1);
  const rows = await db.select().from(attempts).where(and(eq(attempts.trainingSessionId, sessionId), eq(attempts.userId, userId), eq(attempts.isDeleted, false))).orderBy(desc(attempts.attemptNumber));
  return { session, challenge, attempts: rows.reverse() };
}

export async function getAdminStats() {
  const userRows = await db.select().from(users).where(eq(users.isDeleted, false));
  const sessionRows = await db.select().from(trainingSessions).where(eq(trainingSessions.isDeleted, false));
  const attemptRows = await db.select().from(attempts).where(eq(attempts.isDeleted, false));
  const challengeRows = await db.select().from(challenges).where(eq(challenges.isDeleted, false)).orderBy(desc(challenges.createdAt));
  return { users: userRows.length, sessions: sessionRows.length, attempts: attemptRows.length, challenges: challengeRows };
}
