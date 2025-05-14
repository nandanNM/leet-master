import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginUser, RegisterUser } from "../schemas/user";
import { ApiResponse } from "../utils/responses";
import { db } from "../db";
import { usersTable } from "../db/schema";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const { name, email, password, role } = req.body as RegisterUser;
  try {
    const existingUser = await db.query.usersTable.findFirst({
      where: (usersTable, { eq }) => eq(usersTable.email, email),
    });
    if (existingUser) {
      // console.log("existingUser", existingUser);
      return new ApiResponse(400, false, "User already exists!").send(res);
    }
    //TODO: check user with same email and password becose i integrate with google and other auth providers
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
      res.cookie("leet-master-token", token, {
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

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const { email, password } = req.body as LoginUser;
  try {
    const user = await db.query.usersTable.findFirst({
      where: (usersTable, { eq }) => eq(usersTable.email, email),
    });
    if (!user) {
      return new ApiResponse(401, false, "Invalid credentials").send(res);
    }
    //TODO: what if user has no password? becose i intregrate with google and other auth providers
    if (!user.password) {
      return new ApiResponse(401, false, "Invalid credentials").send(res);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new ApiResponse(400, false, "Invalid Password").send(res);
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    res.cookie("leet-master-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return new ApiResponse(
      200,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      `Welcome back ${user.name} 👋`
    ).send(res);
  } catch (error) {
    next(error);
  }
}
export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    res.clearCookie("leet-master-token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return new ApiResponse(204, true, "Logged out successfully").send(res);
  } catch (error) {
    next(error);
  }
}
export async function getUserSessions(
  req: Request,
  res: Response
): Promise<any> {}
