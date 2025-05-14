import express, { Request, Response } from "express";
import { register } from "../controllers/user.controllers";

const router = express.Router();

router.get("/register", register);
