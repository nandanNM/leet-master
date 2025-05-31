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
import {upload} from "src/middlewares/multer.middleware";
import passport from "passport";
import jwt from "jsonwebtoken";
import "dotenv/config";
import {generateToken} from "../utils";

const userRoutes = express.Router();

userRoutes.post("/register", validate(UserSchema), register);
userRoutes.post("/login", validate(LoginSchema), login);
userRoutes.post("/logout", authMiddleware, logout);
userRoutes.get("/current-user", authMiddleware, getUserSessions);
userRoutes.post(
  "/update",
  authMiddleware,
  upload.fields([{name: "avatar", maxCount: 1}]),
  updateUser,
);

// Google OAuth
userRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    accessType: "offline",
  }),
);

userRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
    session: false,
  }),
  (req: Request, res: Response) => {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
    }
    const {id, email} = req.user;
    const accessToken = generateToken({id, email});

    // Secure cookie settings
    res.cookie("leet-master-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Successful redirect with optional state handling
    const redirectUrl = req.query.state
      ? `${process.env.FRONTEND_URL!}${req.query.state}`
      : process.env.FRONTEND_URL!;

    res.redirect(redirectUrl);
  },
);
export default userRoutes;
