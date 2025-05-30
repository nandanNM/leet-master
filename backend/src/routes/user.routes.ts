import express, {Request, Response} from "express";
import {
  register,
  login,
  logout,
  getUserSessions,
  updateUser,
} from "../controllers/user.controllers";
import {validate} from "../middlewares/validate.middleware";
import {LoginSchema, UpdateUserSchema, UserSchema} from "../schemas/user";
import {authMiddleware} from "../middlewares/auth.middleware";

const userRoutes = express.Router();

userRoutes.post("/register", validate(UserSchema), register);
userRoutes.post("/login", validate(LoginSchema), login);
userRoutes.post("/logout", authMiddleware, logout);
userRoutes.get("/current-user", authMiddleware, getUserSessions);
userRoutes.get(
  "/update",
  validate(UpdateUserSchema),
  authMiddleware,
  updateUser,
);

export default userRoutes;
