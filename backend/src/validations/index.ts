import {z} from "zod";

export const createProblemSchema = z.object({
  title: z.string().min(3).max(255),

  slug: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-z0-9-]$/, "Slug must be lowercase and hyphen separated"),

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
    .regex(/^[a-z0-9-]$/)
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

export const createChallengeSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters.")
      .max(255, "Title is too long.")
      .optional(),

    problemId: z
      .string({required_error: "problemId is required."})
      .uuid("Invalid problem ID format."),

    invitedUserIds: z
      .array(z.string().uuid("Invalid User ID format."))
      .optional()
      .default([]),

    invitedEmails: z
      .array(z.string().email("Invalid email format."))
      .optional()
      .default([]),

    // Duration for the challenge itself once started (e.g., 20 mins)
    durationMinutes: z
      .number()
      .int()
      .min(1, "Duration must be at least 1 minute.")
      .max(1440, "Duration cannot exceed 24 hours."),

    // When the invite/link expires (deadline to join)
    expiresAt: z
      .string()
      .datetime({message: "Invalid expiration date format (ISO 8601)."})
      .refine((val) => new Date(val) > new Date(), {
        message: "Expiration date must be in the future.",
      }),

    // Optional: If provided, the match is scheduled. If null, it starts on creator trigger.
    startsAt: z
      .string()
      .datetime({message: "Invalid start date format."})
      .optional()
      .refine((val) => !val || new Date(val) > new Date(), {
        message: "Scheduled start time must be in the future.",
      }),
  })
  .refine(
    (data) =>
      !data.startsAt || new Date(data.startsAt) < new Date(data.expiresAt),
    {
      message: "Scheduled start time must be before the expiration date.",
      path: ["startsAt"],
    },
  );

export const respondChallengeSchema = z.object({
  challengeId: z
    .string({required_error: "challengeId is required."})
    .uuid("Invalid challenge ID."),

  action: z.enum(["ACCEPTED", "DECLINED"], {
    required_error: "Action must be either ACCEPTED or DECLINED.",
  }),
});
export const acceptEmailInviteSchema = z.object({
  token: z.string().min(1, "Invitation token is required."),
});

export const requiredId = z.object({
  id: z.string().uuid("Invalid Challenge ID format."),
});

export type CreateProblem = z.infer<typeof createProblemSchema>;
export type UpdateProblem = z.infer<typeof updateProblemSchema>;
export type CreateChallenge = z.infer<typeof createChallengeSchema>;
export type RespondChallenge = z.infer<typeof respondChallengeSchema>;
export type AcceptEmailInvite = z.infer<typeof acceptEmailInviteSchema>;
