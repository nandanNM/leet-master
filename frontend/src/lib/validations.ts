import { z } from "zod";
export const signUpSchema = z
  .object({
    name: z.string({ message: "Name is required" }).min(3),
    email: z.string({ message: "Email is required" }).email().min(5).max(50),
    password: z
      .string({ message: "Password is required" })
      .min(8, { message: "Password must at least 8 characters" })
      .regex(/[A-z]/, "Password at leat One Uppercase")
      .regex(/[a-z]/, "Password at least one lowercase")
      .regex(/[0-9]/, "Password at least one number")
      .regex(/[@#$%^&*]/, "Password at least one special character"),
    confirmPassword: z.string({ message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password must be same",
    path: ["confirmPassword"],
  });
export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string({ message: "Email is required" }).email().min(5).max(50),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must at least 8 characters" })
    .regex(/[A-z]/, "Password at leat One Uppercase")
    .regex(/[a-z]/, "Password at least one lowercase")
    .regex(/[0-9]/, "Password at least one number")
    .regex(/[@#$%^&*]/, "Password at least one special character"),
});
export type LoginValues = z.infer<typeof loginSchema>;

const exampleSchema = z.object({
  input: z.string().trim().min(1, "Input is required"),
  output: z.string().trim().min(1, "Output is required"),
  explanation: z.string().trim().optional(),
});

const codeSchema = z.string().trim().min(1, "Code snippet is required");

export const problemSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty")
        .max(20, "Tag is too long"),
    )
    .min(1, "At least one tag is required"),
  constraints: z.string().trim().min(1, "Constraints are required"),
  hints: z.string().trim().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().trim().min(1, "Input is required"),
        output: z.string().trim().min(1, "Output is required"),
      }),
    )
    .min(1, "At least one test case is required"),

  examples: z.object({
    JAVASCRIPT: exampleSchema,
    PYTHON: exampleSchema,
    JAVA: exampleSchema,
  }),

  codeSnippets: z.object({
    JAVASCRIPT: codeSchema,
    PYTHON: codeSchema,
    JAVA: codeSchema,
  }),

  referenceSolutions: z.object({
    JAVASCRIPT: codeSchema,
    PYTHON: codeSchema,
    JAVA: codeSchema,
  }),
});
export type ProblemValues = z.infer<typeof problemSchema>;

export const playlistSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
});
export type PlaylistValues = z.infer<typeof playlistSchema>;
export const submissionSchema = z
  .object({
    source_code: z.string().min(1, "source_code is required"),
    language_id: z.union([z.string(), z.number()]),
    problemId: z.string().uuid("Invalid problemId"),
    stdin: z.array(z.string()).min(1, "stdin must have at least one test case"),
    expected_outputs: z.array(z.string()),
  })
  .refine((data) => data.stdin.length === data.expected_outputs.length, {
    message: "expected_outputs length must match stdin length",
    path: ["expected_outputs"],
  });
export type SubmissionValues = z.infer<typeof submissionSchema>;
export type Problem = ProblemValues & {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
export type ProblemWithSolvedStatus = Problem & {
  isSolved: boolean;
};
export type BasicPlaylist = PlaylistValues & {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
export type PlaylistProblemRelation = {
  id: string;
  playListId: string;
  problemId: string;
  createdAt: string;
  updatedAt: string;
  problem: Problem;
};
export type PlaylistWithProblems = PlaylistValues & {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  problems: PlaylistProblemRelation[];
};
export const testCaseSchema = z.object({
  submissionId: z.string().uuid(),
  testCase: z.number().int().positive(),
  passed: z.boolean(),
  stdout: z.string().nullable(),
  expected: z.string(),
  stderr: z.string().nullable(),
  compileOutput: z.string().nullable(),
  status: z.enum([
    "Accepted",
    "Wrong Answer",
    "Time Limit Exceeded",
    "Runtime Error",
    "Compile Error",
  ]),
  memory: z.string(),
  time: z.string(),
});
export type TestCase = z.infer<typeof testCaseSchema>;
export const submissionResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  problemId: z.string().uuid(),
  sourceCode: z.string(),
  language: z.string(),
  stdin: z.string(),
  stdout: z.string(),
  stderr: z.string().nullable(),
  compileOutput: z.string().nullable(),
  status: z.enum([
    "ACCEPTED",
    "WRONG_ANSWER",
    "TIME_LIMIT_EXCEEDED",
    "RUNTIME_ERROR",
    "COMPILE_ERROR",
  ]),
  memory: z.string(),
  time: z.string(),
  // memory: z.string().transform((val) => JSON.parse(val) as string[]).optional(),
  // time: z.string().transform((val) => JSON.parse(val) as string[]).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type SubmissionWithTestCases = SubmissionResponse & {
  testCases: TestCase[];
};
export type SubmissionResponse = z.infer<typeof submissionResponseSchema>;
export type TestCaseResult = z.infer<typeof testCaseSchema>;
