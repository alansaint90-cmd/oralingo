import type { SpeechAnalysis } from "@/lib/db/schema";

export function AnalysisView({ analysis, wordCount, wordsPerMinute }: { analysis: SpeechAnalysis; wordCount?: number; wordsPerMinute?: number }) {
  const skills = [
    ["Clareza", analysis.clareza],
    ["Objetividade", analysis.objetividade],
    ["Estrutura", analysis.estrutura],
    ["Persuasao", analysis.persuasao],
    ["Confianca percebida", analysis.confianca_percebida]
  ];

  return (
    <div className="stack">
      <div className="panel spread">
        <div>
          <span className="eyebrow">Resultado da missao</span>
          <div className="score">{analysis.nota_geral}/100</div>
        </div>
        <div>
          <p><strong>Ritmo:</strong> {wordsPerMinute ?? "-"} ppm</p>
          <p><strong>Palavras:</strong> {wordCount ?? "-"}</p>
        </div>
      </div>
      <div className="grid-2">
        {skills.map(([label, value]) => (
          <div className="lesson-card" key={label}>
            <div className="spread"><strong>{label}</strong><span>{value}</span></div>
            <div className="skill-bar"><span style={{ width: `${value}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card"><span className="badge">Forca</span><p>{analysis.pontos_fortes[0]}</p></div>
        <div className="card"><span className="badge">Proxima fase</span><p>{analysis.pontos_melhoria[0]}</p></div>
      </div>
      <div className="card">
        <strong>Vicios de linguagem</strong>
        <p>{analysis.vicios_linguagem.length ? analysis.vicios_linguagem.map((item) => `${item.palavra}: ${item.quantidade}`).join(", ") : "Nenhum uso excessivo identificado."}</p>
      </div>
      <div className="lesson-card"><strong>Orientacao do treinador</strong><p>{analysis.orientacao_principal}</p></div>
    </div>
  );
}
