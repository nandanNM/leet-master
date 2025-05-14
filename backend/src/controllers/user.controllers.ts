import { NextFunction, Request, Response } from "express";
import { User } from "../schemas/user";
import { ApiResponse } from "../utils/responses";
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { name, age, email } = req.body as User;
  try {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { name, age, email },
          "User registered successfully"
        )
      );
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
