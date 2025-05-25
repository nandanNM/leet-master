import { z } from "zod";

export const PlaylistSchema = z.object({
  name: z
    .string({
      required_error: "Playlist name is required.",
      invalid_type_error: "Playlist name must be a string.",
    })
    .min(1, { message: "Playlist name cannot be empty." })
    .max(255, { message: "Playlist name must be at most 255 characters." }),

  description: z
    .string({ invalid_type_error: "Description must be text." })
    .optional()
    .nullable(),
});

export type Playlist = z.infer<typeof PlaylistSchema>;
