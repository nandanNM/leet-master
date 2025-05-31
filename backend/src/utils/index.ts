import "dotenv/config";
import jwt from "jsonwebtoken";
export const slugifyName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

export function generateToken(user: {id: string; email: string}): string {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
    algorithm: "HS256",
    issuer: "leet-master",
    audience: "web",
  });
}
