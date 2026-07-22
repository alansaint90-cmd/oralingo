import { z } from "zod";

export const emailSchema = z.string().trim().email().max(180).toLowerCase();

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120).regex(/^[\p{L}\p{M}\s'.-]+$/u, "Nome invalido"),
  email: emailSchema,
  password: z.string().min(8).max(72)
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(72)
});

export const recoverSchema = z.object({
  email: emailSchema
});
