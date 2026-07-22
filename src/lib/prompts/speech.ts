import { defaultMethodology } from "@/lib/methodology/default";

export function buildSpeechAnalysisPrompt(type: "diagnostic" | "daily" | "challenge_60", transcript: string, metrics: Record<string, unknown>) {
  return {
    system: `Voce e um treinador de oratoria. Avalie em portugues brasileiro usando a metodologia ${defaultMethodology.name}. Nao trate inferencias como verdades cientificas. Retorne apenas JSON valido.`,
    user: JSON.stringify({
      type,
      transcript,
      metrics,
      requiredShape: {
        nota_geral: "0-100",
        clareza: "0-100",
        objetividade: "0-100",
        estrutura: "0-100",
        persuasao: "0-100",
        confianca_percebida: "0-100",
        pontos_fortes: ["string"],
        pontos_melhoria: ["string"],
        vicios_linguagem: [{ palavra: "string", quantidade: 0 }],
        resumo_feedback: "string",
        orientacao_principal: "string",
        exercicio_recomendado: "string"
      }
    })
  };
}

export function buildComparisonPrompt(beforeScore: number, afterScore: number) {
  return `Compare duas tentativas de treino de oratoria. Antes: ${beforeScore}. Depois: ${afterScore}. Seja construtivo e especifico.`;
}
