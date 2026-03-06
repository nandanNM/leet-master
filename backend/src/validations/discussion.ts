import {z} from "zod";

export const DiscussionSchema = z.object({
  message: z
    .string({
      required_error: "message is required.",
      invalid_type_error: "message must be a string.",
    })
    .min(1, {message: "message cannot be empty."}),
});

export type Discussion = z.infer<typeof DiscussionSchema>;
