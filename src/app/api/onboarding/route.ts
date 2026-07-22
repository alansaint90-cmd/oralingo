import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userProfiles, users } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth/session";
import { onboardingSchema } from "@/lib/validators/onboarding";
import { trackEvent } from "@/lib/analytics/events";

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const input = onboardingSchema.parse(await request.json());

    await db.insert(userProfiles).values({
      userId: session.userId,
      mainGoal: input.mainGoal,
      difficulties: input.difficulties,
      communicationLevel: input.communicationLevel,
      communicationContexts: input.communicationContexts,
      modifiedBy: session.userId
    }).onConflictDoUpdate({
      target: userProfiles.userId,
      set: {
        mainGoal: input.mainGoal,
        difficulties: input.difficulties,
        communicationLevel: input.communicationLevel,
        communicationContexts: input.communicationContexts,
        updatedAt: new Date(),
        modifiedBy: session.userId
      }
    });

    await db.update(users).set({ onboardingCompleted: true, updatedAt: new Date(), modifiedBy: session.userId }).where(eq(users.id, session.userId));
    await trackEvent(session.userId, "onboarding_concluido");

    return NextResponse.json({ ok: true, redirectTo: "/app/diagnostico" });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Falha no onboarding" }, { status: 400 });
  }
}
