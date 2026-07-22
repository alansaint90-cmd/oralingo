import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getPersonalizedDailyChallenge } from "@/lib/services/challenges";
import { PracticeClient } from "@/components/features/PracticeClient";

export default async function DailyTrainingPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const challenge = await getPersonalizedDailyChallenge(session.userId);
  if (!challenge) redirect("/app/dashboard");
  return <PracticeClient challenge={challenge} type="daily" />;
}
