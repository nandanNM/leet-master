import {z} from "zod";

export const DiscussionSchema = z.object({
  message: z
    .string({
      required_error: "message is required.",
      invalid_type_error: "message must be a string.",
    })
    .min(1, {message: "message cannot be empty."})
    .max(2000, {message: "message cannot exceed 2000 characters."}),
  parentId: z.string().uuid("Invalid parentId").optional(),
});

export type Discussion = z.infer<typeof DiscussionSchema>;
