import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../schemas/user";
import { ApiResponse } from "../utils/responses";
import { db } from "../db";
import { usersTable } from "../db/schema";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const { name, email, password, role } = req.body as User;
  try {
    const existingUser = await db.query.usersTable.findFirst({
      where: (usersTable, { eq }) => eq(usersTable.email, email),
    });
    if (existingUser) {
      // console.log("existingUser", existingUser);
      return new ApiResponse(400, false, "User already exists!").send(res);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [newUser] = await db
        .insert(usersTable)
        .values({
          name,
          email,
          password: hashedPassword,
          role,
        })
        .returning();
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );
      res.cookie("leet-mastertoken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return new ApiResponse(
        200,
        {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
          token,
        },
        `🎉 Success! ${newUser.name} is now part of the system ✨`
      ).send(res);
    }
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response): Promise<void> {}
export async function logout(req: Request, res: Response): Promise<void> {}
export async function getUserSessions(
  req: Request,
  res: Response
): Promise<void> {}
