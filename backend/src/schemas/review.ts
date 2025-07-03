import {z} from "zod";

export const codeReviewSchema = z.object({
  code: z
    .string({
      required_error: "Code is required",
      invalid_type_error: "Code must be a string",
    })
    .min(1, "Code cannot be empty"),

  language: z
    .string({
      required_error: "Language is required",
      invalid_type_error: "Language must be a string",
    })
    .min(1, "Language cannot be empty"),

  problemTitle: z
    .string({
      required_error: "Problem title is required",
      invalid_type_error: "Problem title must be a string",
    })
    .min(1, "Problem title cannot be empty"),
});
export type CodeReview = z.infer<typeof codeReviewSchema>;
