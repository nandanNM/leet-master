import { NextFunction, Request, Response } from "express";

// Extend the Request interface to include the user property

import jwt from "jsonwebtoken";
import { db } from "../db";
import { ne } from "drizzle-orm";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const token = req.cookies["leet-master-token"];
    if (!token) {
      return res.status(401).json({ message: " Unauthorized Access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded || typeof decoded === "string") {
      return res.status(401).json({ message: " Unauthorized Access" });
    }
    const { id, email } = decoded as jwt.JwtPayload;
    const user = await db.query.usersTable.findFirst({
      where: (usersTable, { eq }) => eq(usersTable.email, email),
    });
    if (!user) {
      return res.status(401).json({ message: " Unauthorized Access" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
