import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().int().optional(), // optional for creation, as it's auto-generated
  name: z.string().min(1).max(255),
  age: z.number().int(),
  email: z.string().email().max(255),
});

export type User = z.infer<typeof UserSchema>;
