import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getSessionResult } from "@/lib/services/queries";
import { AnalysisView } from "@/components/features/AnalysisView";
import { RetryClient } from "@/components/features/RetryClient";

export default async function ResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { sessionId } = await params;
  const data = await getSessionResult(session.userId, sessionId);
  const attempt = data?.attempts.at(-1);
  if (!data || !attempt) redirect("/app/dashboard");

  return (
    <section className="stack-lg">
      <div className="spread">
        <div>
          <span className="eyebrow">XP liberado</span>
          <h1 className="page-title compact">{data.session.type === "diagnostic" ? "Seu diagnostico esta pronto." : "Resultado da missao"}</h1>
          <p className="muted">{data.challenge?.title}</p>
        </div>
        <Link className="button ghost" href="/app/dashboard">Dashboard</Link>
      </div>
      <AnalysisView analysis={attempt.analysisJson} wordCount={attempt.wordCount} wordsPerMinute={attempt.wordsPerMinute} />
      {data.session.type === "challenge_60" ? <RetryClient challenge={data.challenge!} sessionId={sessionId} nextAttempt={attempt.attemptNumber + 1} /> : <div className="row"><Link className="button" href="/app/treino">Proxima missao</Link><Link className="button secondary" href="/app/dashboard">Concluir</Link></div>}
    </section>
  );
}
