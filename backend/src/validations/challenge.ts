import {z} from "zod";

export const createChallengeSchema = z.object({
  problemId: z.string().uuid("Invalid problem ID"),
  mode: z.enum(["1v1", "group"]).default("1v1"),
  maxParticipants: z.number().int().min(2).max(10).optional(),
  durationSeconds: z.number().int().min(300).max(14400).optional(),
});

export type CreateChallenge = z.infer<typeof createChallengeSchema>;
