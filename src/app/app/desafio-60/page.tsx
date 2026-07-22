import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
import { PracticeClient } from "@/components/features/PracticeClient";
import { demoChallenge60 } from "@/lib/demo/data";

export default async function Challenge60Page() {
  const [challenge] = await db
    .select()
    .from(challenges)
    .where(and(eq(challenges.category, "desafio_60"), eq(challenges.active, true), eq(challenges.isDeleted, false)))
    .limit(1)
    .catch(() => [demoChallenge60]);
  if (!challenge) return <section className="panel">Nenhum desafio ativo.</section>;
  return <PracticeClient challenge={challenge} type="challenge_60" />;
}
