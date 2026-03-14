import {z} from "zod";

export const createProblemSchema = z.object({
  title: z.string().min(3).max(255),

  slug: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase and hyphen separated"),

  description: z.string().min(10),

  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),

  videoUrl: z.string().url().optional(),

  examples: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string().optional(),
    }),
  ),

  constraints: z.string().optional(),

  hints: z.string().optional(),

  editorialCode: z.record(z.string()).optional(),

  codeSnippets: z
    .record(
      z.object({
        code: z.string(),
        language: z.string(),
      }),
    )
    .optional(),

  referenceSolutions: z.record(z.string()).optional(),

  driverCode: z.record(z.string()).optional(),

  timeLimit: z.number().int().positive().default(2000),

  memoryLimit: z.number().int().positive().default(256),

  testCases: z.array(
    z.object({
      input: z.string(),
      expectedOutput: z.string(),
      isSample: z.boolean().optional(),
      order: z.number().int().optional(),
    }),
  ),
});

export const updateProblemSchema = z.object({
  title: z.string().min(3).max(255).optional(),

  slug: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-z0-9-]+$/)
    .optional(),

  description: z.string().min(10).optional(),

  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),

  videoUrl: z.string().url().optional(),

  examples: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
        explanation: z.string().optional(),
      }),
    )
    .optional(),

  constraints: z.string().optional(),

  hints: z.string().optional(),

  editorialCode: z.record(z.string()).optional(),

  codeSnippets: z
    .record(
      z.object({
        code: z.string(),
        language: z.string(),
      }),
    )
    .optional(),

  referenceSolutions: z.record(z.string()).optional(),

  driverCode: z.record(z.string()).optional(),

  timeLimit: z.number().int().positive().optional(),

  memoryLimit: z.number().int().positive().optional(),

  testCases: z
    .array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
        isSample: z.boolean().optional(),
        order: z.number().int().optional(),
      }),
    )
    .optional(),
});

export type CreateProblem = z.infer<typeof createProblemSchema>;
export type UpdateProblem = z.infer<typeof updateProblemSchema>;
