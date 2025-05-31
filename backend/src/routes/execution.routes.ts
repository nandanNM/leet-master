import {Router} from "express";
import {authMiddleware} from "../middlewares/auth.middleware";
import {executeCode, runCode} from "../controllers/execute-code.controllers";
import {validate} from "../middlewares/validate.middleware";
import {submitCodeSchema} from "../schemas/submit-code";

const executionRoutes = Router();

executionRoutes.post(
  "/submit-code",
  validate(submitCodeSchema),
  authMiddleware,
  executeCode,
);
executionRoutes.post(
  "/run-code",
  validate(submitCodeSchema),
  authMiddleware,
  runCode,
);

export default executionRoutes;
