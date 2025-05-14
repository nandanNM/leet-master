import express, { Request, Response } from "express";
import {
  register,
  login,
  logout,
  getUserSessions,
} from "../controllers/user.controllers";
import { validate } from "../middlewares/validate";
import { LoginSchema, UserSchema } from "../schemas/user";

const userRoutes = express.Router();

userRoutes.post("/register", validate(UserSchema), register);
userRoutes.post("/login", validate(LoginSchema), login);
userRoutes.post("/logout", logout);
userRoutes.get("/sessions", getUserSessions);

export default userRoutes;
