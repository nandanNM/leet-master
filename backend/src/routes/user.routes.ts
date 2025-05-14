import express, { Request, Response } from "express";
import {
  register,
  login,
  logout,
  getUserSessions,
} from "../controllers/user.controllers";
import { validate } from "../middlewares/validate";
import { UserSchema } from "../schemas/user";

const userRoutes = express.Router();

userRoutes.post("/register", validate(UserSchema), register);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);
userRoutes.get("/sessions", getUserSessions);

export default userRoutes;
