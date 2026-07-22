import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trainingSessions } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";
import { createSessionSchema } from "@/lib/validators/attempts";
import { trackEvent } from "@/lib/analytics/events";
import { demoSessionId, demoUserId } from "@/lib/demo/data";

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const input = createSessionSchema.parse(await request.json());
    if (session.userId === demoUserId) {
      return NextResponse.json({ ok: true, sessionId: demoSessionId });
    }

    const [created] = await db.insert(trainingSessions).values({
      userId: session.userId,
      challengeId: input.challengeId,
      type: input.type,
      modifiedBy: session.userId
    }).returning();

    const event = input.type === "diagnostic" ? "diagnostico_iniciado" : input.type === "daily" ? "treino_diario_iniciado" : "desafio_60_iniciado";
    await trackEvent(session.userId, event);

    return NextResponse.json({ ok: true, sessionId: created.id });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Falha ao iniciar sessao" }, { status: 400 });
  }
}
