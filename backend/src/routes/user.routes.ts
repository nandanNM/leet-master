import express, { Request, Response } from "express";
import {
  register,
  login,
  logout,
  getUserSessions,
} from "../controllers/user.controllers";
import { validate } from "../middlewares/validate.middleware";
import { LoginSchema, UserSchema } from "../schemas/user";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRoutes = express.Router();

userRoutes.post("/register", validate(UserSchema), register);
userRoutes.post("/login", validate(LoginSchema), login);
userRoutes.post("/logout", authMiddleware, logout);
userRoutes.get("/sessions", authMiddleware, getUserSessions);

export default userRoutes;
