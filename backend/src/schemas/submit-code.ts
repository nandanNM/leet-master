import { z } from "zod";

export const submitCodeSchema = z
  .object({
    source_code: z.string().min(1, "source_code is required"),
    language_id: z.union([z.string(), z.number()]),
    probleamId: z.string().uuid("Invalid probleamId"),
    stdin: z.array(z.string()).min(1, "stdin must have at least one test case"),
    expected_outputs: z.array(z.string()),
  })
  .refine((data) => data.stdin.length === data.expected_outputs.length, {
    message: "expected_outputs length must match stdin length",
    path: ["expected_outputs"],
  });
export type SubmitCode = z.infer<typeof submitCodeSchema>;
