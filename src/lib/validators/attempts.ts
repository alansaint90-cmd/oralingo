import { z } from "zod";

export const createSessionSchema = z.object({
  challengeId: z.string().uuid(),
  type: z.enum(["diagnostic", "daily", "challenge_60"])
});

export const submitAttemptSchema = z.object({
  sessionId: z.string().uuid(),
  attemptNumber: z.number().int().min(1).max(10),
  durationSeconds: z.number().int().min(5).max(600),
  transcript: z.string().trim().max(15000).optional().default(""),
  audioDataUrl: z.string().startsWith("data:audio/").max(12_000_000).optional()
}).refine((input) => input.transcript.length >= 10 || Boolean(input.audioDataUrl), {
  message: "Envie um audio ou uma transcricao com pelo menos 10 caracteres",
  path: ["audioDataUrl"]
});

export const challengeSchema = z.object({
  title: z.string().trim().min(4).max(160),
  description: z.string().trim().min(10).max(1200),
  instructions: z.string().trim().min(10).max(1200),
  category: z.string().trim().min(3).max(80),
  primarySkill: z.string().trim().min(3).max(80),
  difficulty: z.string().trim().min(3).max(40),
  preparationTime: z.number().int().min(0).max(300),
  speakingTime: z.number().int().min(15).max(300),
  active: z.boolean()
});
