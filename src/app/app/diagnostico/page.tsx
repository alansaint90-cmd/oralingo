import { redirect } from "next/navigation";
import { getDiagnosticChallenge } from "@/lib/services/challenges";
import { PracticeClient } from "@/components/features/PracticeClient";

export default async function DiagnosticPage() {
  const challenge = await getDiagnosticChallenge();
  if (!challenge) redirect("/app/dashboard");
  return <PracticeClient challenge={challenge} type="diagnostic" />;
}
