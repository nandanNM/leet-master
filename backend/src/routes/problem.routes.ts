import { Router } from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemsSolvedByUser,
  getProblemById,
  updateProblem,
} from "../controllers/problem.controllers";
import { validate } from "../middlewares/validate.middleware";
import { ProblemSchema } from "../schemas/problem";

const problemRoutes = Router();

problemRoutes.post(
  "/create-probleam",
  validate(ProblemSchema),
  authMiddleware,
  checkAdmin,
  createProblem
);
problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);
problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);
problemRoutes.put(
  "/update-problem/:id",
  authMiddleware,
  checkAdmin,
  updateProblem
);
problemRoutes.delete(
  "/delete-problem/:id",
  authMiddleware,
  checkAdmin,
  deleteProblem
);
problemRoutes.get(
  "/get-solved-problems",
  authMiddleware,
  getAllProblemsSolvedByUser
);
export default problemRoutes;
