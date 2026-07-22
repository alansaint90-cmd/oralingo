import { z } from "zod";

const score = z.number().int().min(0).max(100);

export const speechAnalysisSchema = z.object({
  nota_geral: score,
  clareza: score,
  objetividade: score,
  estrutura: score,
  persuasao: score,
  confianca_percebida: score,
  pontos_fortes: z.array(z.string().min(3).max(240)).min(1).max(5),
  pontos_melhoria: z.array(z.string().min(3).max(240)).min(1).max(5),
  vicios_linguagem: z.array(z.object({
    palavra: z.string().min(1).max(60),
    quantidade: z.number().int().min(0).max(999)
  })).max(20),
  resumo_feedback: z.string().min(10).max(800),
  orientacao_principal: z.string().min(10).max(800),
  exercicio_recomendado: z.string().min(10).max(500)
});

export type SpeechAnalysisResult = z.infer<typeof speechAnalysisSchema>;
