import { Request } from "express";
export function isAuthenticated(
  req: Request
): req is Request & { user: { id: string; email: string; role: string } } {
  return !!req.user;
}
