import {Router} from "express";
import {requireAnyAuth, requireAdmin} from "../middlewares/role.middleware";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemsSolvedByUser,
  getProblemById,
  getUserSolvedRank,
  updateProblem,
} from "../controllers/problem.controllers";
import {validate} from "../middlewares/validate.middleware";
import {ProblemSchema} from "../validations/problem";

const problemRoutes = Router();

problemRoutes.post(
  "/create-problem",
  validate(ProblemSchema),
  requireAnyAuth,
  requireAdmin,
  createProblem,
);
problemRoutes.get("/get-all-problems", requireAnyAuth, getAllProblems);
problemRoutes.get("/get-problem/:id", requireAnyAuth, getProblemById);
problemRoutes.put(
  "/update-problem/:id",
  validate(ProblemSchema),
  requireAnyAuth,
  requireAdmin,
  updateProblem,
);
problemRoutes.delete(
  "/delete-problem/:id",
  requireAnyAuth,
  requireAdmin,
  deleteProblem,
);
problemRoutes.get(
  "/get-solved-problems",
  requireAnyAuth,
  getAllProblemsSolvedByUser,
);
problemRoutes.get("/user-rank/:id", requireAnyAuth, getUserSolvedRank);

export default problemRoutes;
