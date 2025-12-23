import {z} from "zod";

export const codeReviewSchema = z.object({
  code: z.string().min(1, "Code cannot be empty"),
  language: z.string({}).min(1, "Language cannot be empty"),
  problemTitle: z.string({}).min(1, "Problem title cannot be empty"),
});
export type CodeReview = z.infer<typeof codeReviewSchema>;
