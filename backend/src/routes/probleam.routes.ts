import { Router } from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware";
import {
  createProbleam,
  deleteProbleam,
  getAllProbleams,
  getAllProbleamsSolvedByUser,
  getProbleamById,
  updateProbleam,
} from "../controllers/probleam.controllers";
import { validate } from "../middlewares/validate.middleware";
import { ProbleamSchema } from "../schemas/probleam";

const probleamRoutes = Router();

probleamRoutes.post(
  "/create-probleam",
  validate(ProbleamSchema),
  authMiddleware,
  checkAdmin,
  createProbleam
);
probleamRoutes.get("/get-all-probleams", authMiddleware, getAllProbleams);
probleamRoutes.get("/get-probleam/:id", authMiddleware, getProbleamById);
probleamRoutes.put(
  "/update-probleam/:id",
  validate(ProbleamSchema),
  authMiddleware,
  checkAdmin,
  updateProbleam
);
probleamRoutes.delete(
  "/delete-probleam/:id",
  authMiddleware,
  checkAdmin,
  deleteProbleam
);
probleamRoutes.get(
  "/get-solved-probleams",
  authMiddleware,
  getAllProbleamsSolvedByUser
);
export default probleamRoutes;
