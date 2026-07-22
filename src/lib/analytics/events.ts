import { db } from "@/lib/db";
import { analyticsEvents } from "@/lib/db/schema";

export type AnalyticsEventName =
  | "usuario_cadastrado"
  | "onboarding_iniciado"
  | "onboarding_concluido"
  | "diagnostico_iniciado"
  | "diagnostico_concluido"
  | "treino_diario_iniciado"
  | "treino_diario_concluido"
  | "desafio_60_iniciado"
  | "primeira_tentativa_concluida"
  | "segunda_tentativa_iniciada"
  | "segunda_tentativa_concluida"
  | "usuario_retornou_para_treinar";

export async function trackEvent(userId: string | null, name: AnalyticsEventName, metadata: Record<string, unknown> = {}) {
  await db.insert(analyticsEvents).values({
    userId,
    name,
    metadata,
    modifiedBy: userId
  });
}
