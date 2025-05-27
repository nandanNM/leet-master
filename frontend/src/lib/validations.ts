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
  tags: z.array(z.string().trim()).min(1, "At least one tag is required"),
  constraints: z.string().trim().min(1, "Constraints are required"),
  hints: z.string().trim().optional(),
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
