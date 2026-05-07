import {Router} from "express";
import {requireAnyAuth, requireAdmin} from "../middlewares/role.middleware";
import {createProblem, getProblemById} from "../controllers/problem.controllers";
import {validate} from "../middlewares/validate.middleware";
import {createProblemSchema, updateProblemSchema} from "../validations";

const problemRoutes = Router();

problemRoutes.post(
  "/create",
  validate(createProblemSchema),
  requireAdmin,
  createProblem,
);

problemRoutes.get("/:id", requireAnyAuth, getProblemById);
// problemRoutes.get("/get-all-problems", requireAnyAuth, getAllProblems);
// problemRoutes.get("/get-problem/:id", requireAnyAuth, getProblemById);
// problemRoutes.put(
//   "/update-problem/:id",
//   validate(updateProblemSchema),
//   requireAnyAuth,
//   requireAdmin,
//   updateProblem,
// );
// problemRoutes.delete(
//   "/delete-problem/:id",
//   requireAnyAuth,
//   requireAdmin,
//   deleteProblem,
// );
// problemRoutes.get(
//   "/get-solved-problems",
//   requireAnyAuth,
//   getAllProblemsSolvedByUser,
// );
// problemRoutes.get("/user-rank/:id", requireAnyAuth, getUserSolvedRank);

export default problemRoutes;
