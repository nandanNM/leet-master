import {Request, Response, NextFunction} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {LoginUser, RegisterUser} from "../schemas/user";
import {ApiResponse, ApiError, errorResponse} from "../utils/responses";
import {db} from "../db";
import {usersTable} from "../db/schema";
import {asyncHandler} from "../utils/async-handler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const {name, email, password, role} = req.body as RegisterUser;

  const existingUser = await db.query.usersTable.findFirst({
    where: (usersTable, {eq}) => eq(usersTable.email, email),
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists", "USER_EXISTS");
  }

  if (!password) {
    throw new ApiError(400, "Password is required", "MISSING_PASSWORD");
  }

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
    {id: newUser.id, email: newUser.email},
    process.env.JWT_SECRET!,
    {expiresIn: "7d"},
  );

  res.cookie("leet-master-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  new ApiResponse(
    201,
    `🎉 Success! ${newUser.name} is now part of the system ✨`,
    {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    },
  ).send(res);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const {email, password} = req.body as LoginUser;

  const user = await db.query.usersTable.findFirst({
    where: (usersTable, {eq}) => eq(usersTable.email, email),
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  if (!user.password) {
    throw new ApiError(401, "Please use social login", "SOCIAL_LOGIN_REQUIRED");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {id: user.id, email: user.email},
    process.env.JWT_SECRET!,
    {expiresIn: "7d"},
  );

  res.cookie("leet-master-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  new ApiResponse(200, `Welcome back ${user.name} 👋`, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  }).send(res);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("leet-master-token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  new ApiResponse(200, "Logged out successfully").send(res);
});

export const getUserSessions = asyncHandler(
  async (req: Request, res: Response) => {
    // Implementation for getting user sessions
    throw new ApiError(501, "Not implemented", "NOT_IMPLEMENTED");
  },
);
