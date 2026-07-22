import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getSessionResult } from "@/lib/services/queries";

export default async function ComparisonPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { sessionId } = await params;
  const data = await getSessionResult(session.userId, sessionId);
  if (!data || data.attempts.length < 2) redirect(`/app/resultado/${sessionId}`);
  const first = data.attempts[0];
  const second = data.attempts[1];
  const delta = second.overallScore - first.overallScore;
  const rows = [
    ["Clareza", first.analysisJson.clareza, second.analysisJson.clareza],
    ["Objetividade", first.analysisJson.objetividade, second.analysisJson.objetividade],
    ["Estrutura", first.analysisJson.estrutura, second.analysisJson.estrutura],
    ["Persuasao", first.analysisJson.persuasao, second.analysisJson.persuasao]
  ];

  return (
    <section className="stack-lg">
      <div className="panel stack">
        <span className="eyebrow">Comparacao de tentativas</span>
        <h1 className="page-title compact">Veja sua evolucao</h1>
        <div className="xp-bar"><span style={{ width: `${Math.max(12, Math.min(100, second.overallScore))}%` }} /></div>
      </div>
      <div className="metric-grid">
        <div className="card"><span>Primeira tentativa</span><h2 className="big-number">{first.overallScore}/100</h2></div>
        <div className="card"><span>Segunda tentativa</span><h2 className="big-number">{second.overallScore}/100</h2></div>
        <div className="card"><span>Evolucao</span><h2 className="big-number">{delta > 0 ? `+${delta}` : delta} pontos</h2></div>
      </div>
      <div className="panel">
        <table className="table"><thead><tr><th>Habilidade</th><th>Antes</th><th>Depois</th></tr></thead><tbody>{rows.map(([label, before, after]) => <tr key={label}><td>{label}</td><td>{before}</td><td>{after}</td></tr>)}</tbody></table>
      </div>
      <div className="lesson-card">
        {delta >= 0 ? "Voce conseguiu ajustar sua fala e apresentou ganho mensuravel nesta segunda tentativa." : "Sua segunda tentativa trouxe mudancas, mas ainda nao superou a primeira. Isso faz parte do treino; observe os criterios acima e tente novamente com mais foco."}
      </div>
      <div className="row"><Link className="button" href={`/app/resultado/${sessionId}`}>Tentar novamente</Link><Link className="button secondary" href="/app/dashboard">Finalizar desafio</Link></div>
    </section>
  );
}
