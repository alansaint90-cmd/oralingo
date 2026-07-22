import { db } from "@/lib/db";
import { challenges, userProfiles } from "@/lib/db/schema";
import { and, eq, ilike } from "drizzle-orm";
import { demoDailyChallenge, demoDiagnosticChallenge, demoUserId } from "@/lib/demo/data";

export async function getDiagnosticChallenge() {
  try {
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(and(eq(challenges.category, "diagnostico"), eq(challenges.active, true), eq(challenges.isDeleted, false)))
      .limit(1);
    return challenge ?? demoDiagnosticChallenge;
  } catch {
    return demoDiagnosticChallenge;
  }
}

export async function getPersonalizedDailyChallenge(userId: string) {
  if (userId === demoUserId) return demoDailyChallenge;

  const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  const preferred = profile?.difficulties?.[0]?.toLowerCase().includes("organizar") ? "Organizacao" : profile?.mainGoal?.toLowerCase().includes("vender") ? "Persuasao" : "Objetividade";

  const [challenge] = await db
    .select()
    .from(challenges)
    .where(and(ilike(challenges.primarySkill, `%${preferred}%`), eq(challenges.active, true), eq(challenges.isDeleted, false)))
    .limit(1);

  if (challenge) return challenge;

  const [fallback] = await db
    .select()
    .from(challenges)
    .where(and(eq(challenges.active, true), eq(challenges.isDeleted, false)))
    .limit(1);
  return fallback;
}
