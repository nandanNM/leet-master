import { z } from "zod";

export const ProblemSchema = z.object({
  title: z.string().max(255),
  description: z.string(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()),
  examples: z.any(), // or use z.array(z.object(...)) if you know the shape
  constraints: z.string(),
  hints: z.string().nullable().optional(),
  editorial: z.string().nullable().optional(),
  testcases: z.any(),
  codeSnippets: z.any(),
  referenceSolutions: z.any(),
});

export type Problem = z.infer<typeof ProblemSchema>;
