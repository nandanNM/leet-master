import { z } from "zod";

// Enum for roles
const rolesEnum = ["admin", "user"] as const;
export type Role = (typeof rolesEnum)[number];

export const UserSchema = z.object({
  name: z.string().max(255),
  email: z.string().email().max(255),
  password: z.string().max(255).optional(),
  role: z.enum(rolesEnum).default("user"),
});
export const LoginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().max(255),
});
export type RegisterUser = z.infer<typeof UserSchema>;
export type LoginUser = z.infer<typeof LoginSchema>;
