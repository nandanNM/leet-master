import { NextFunction, Request, Response } from "express";

// Extend the Request interface to include the user property

import jwt from "jsonwebtoken";
import { db } from "../db";
import { ne } from "drizzle-orm";
import { errorResponse } from "../utils/responses";

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
      columns: {
        id: true,
        email: true,
        role: true,
      },
    });
    if (!user) {
      return res.status(401).json({ message: " Unauthorized Access" });
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function checkAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }
    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied - Admins only" });
    }
    next();
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
