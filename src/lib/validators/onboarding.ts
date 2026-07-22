import { z } from "zod";

export const onboardingSchema = z.object({
  mainGoal: z.string().min(3).max(120),
  difficulties: z.array(z.string().min(3).max(120)).min(1).max(2),
  communicationLevel: z.string().min(3).max(60),
  communicationContexts: z.array(z.string().min(3).max(120)).min(1).max(8)
});
