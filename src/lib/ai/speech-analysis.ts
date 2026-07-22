import { buildSpeechAnalysisPrompt } from "@/lib/prompts/speech";
import { speechAnalysisSchema, type SpeechAnalysisResult } from "./analysis-schema";
import { extractSpeechMetrics } from "./metrics";

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function localAnalysis(transcript: string, durationSeconds: number): SpeechAnalysisResult {
  const metrics = extractSpeechMetrics(transcript, durationSeconds);
  const fillerPenalty = Math.min(22, metrics.fillerCounts.reduce((sum, item) => sum + item.quantidade, 0) * 3);
  const pacePenalty = metrics.wordsPerMinute < 95 || metrics.wordsPerMinute > 175 ? 10 : 0;
  const lengthBonus = Math.min(12, Math.floor(metrics.wordCount / 18));
  const structureSignals = ["primeiro", "segundo", "por fim", "conclusao", "conclusão", "porque", "portanto"];
  const structureBonus = structureSignals.some((signal) => transcript.toLowerCase().includes(signal)) ? 10 : 0;

  const clareza = clamp(64 + lengthBonus - fillerPenalty / 2 - pacePenalty);
  const objetividade = clamp(66 + (metrics.wordsPerMinute <= 155 ? 8 : -8) - fillerPenalty / 3);
  const estrutura = clamp(60 + structureBonus + lengthBonus - fillerPenalty / 4);
  const persuasao = clamp(58 + (/\b(voce|você|beneficio|resultado|importante|mudar|ajudar)\b/i.test(transcript) ? 12 : 0));
  const confianca = clamp(62 + (metrics.wordsPerMinute >= 105 && metrics.wordsPerMinute <= 165 ? 10 : -4) - fillerPenalty / 3);
  const nota = clamp((clareza + objetividade + estrutura + persuasao + confianca) / 5);

  const mainFiller = metrics.fillerCounts[0];

  return {
    nota_geral: nota,
    clareza,
    objetividade,
    estrutura,
    persuasao,
    confianca_percebida: confianca,
    pontos_fortes: [
      nota >= 72 ? "Voce sustentou a mensagem com boa consistencia." : "Voce ja tem material suficiente para construir uma fala melhor.",
      persuasao >= 70 ? "A fala trouxe sinais de relevancia para quem escuta." : "Existe uma ideia central que pode ser destacada com mais forca."
    ],
    pontos_melhoria: [
      objetividade < 72 ? "Chegue ao argumento principal mais cedo." : "Use uma conclusao mais marcante para fechar a ideia.",
      estrutura < 72 ? "Organize a fala em abertura, desenvolvimento e fechamento." : "Reduza pequenas repeticoes para ganhar ritmo."
    ],
    vicios_linguagem: metrics.fillerCounts,
    resumo_feedback: `Sua fala teve cerca de ${metrics.wordCount} palavras em ${durationSeconds} segundos, com ritmo aproximado de ${metrics.wordsPerMinute} palavras por minuto. A avaliacao combina metricas objetivas e leitura interpretativa do discurso.`,
    orientacao_principal: mainFiller
      ? `Voce usou "${mainFiller.palavra}" ${mainFiller.quantidade} vez(es). Na proxima tentativa, substitua esse preenchimento por uma pausa curta.`
      : "Na proxima tentativa, anuncie sua ideia principal nos primeiros 10 segundos e finalize com uma frase de acao.",
    exercicio_recomendado: "Repita o mesmo tema buscando uma abertura direta, uma ideia central clara e uma conclusao em uma frase."
  };
}

async function openAiAnalysis(type: "diagnostic" | "daily" | "challenge_60", transcript: string, durationSeconds: number) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const metrics = extractSpeechMetrics(transcript, durationSeconds);
  const prompt = buildSpeechAnalysisPrompt(type, transcript, metrics);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_ANALYSIS_MODEL ?? "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user }
      ]
    })
  });

  if (!response.ok) return null;
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    return speechAnalysisSchema.parse(JSON.parse(content));
  } catch {
    return null;
  }
}

export async function analyzeSpeech(type: "diagnostic" | "daily" | "challenge_60", transcript: string, durationSeconds: number) {
  const ai = await openAiAnalysis(type, transcript, durationSeconds);
  return ai ?? speechAnalysisSchema.parse(localAnalysis(transcript, durationSeconds));
}
