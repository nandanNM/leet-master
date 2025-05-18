import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { executeCode } from "../controllers/execute-code.controllers";
import { validate } from "../middlewares/validate.middleware";
import { submitCodeSchema } from "../schemas/submit-code";

const executionRoutes = Router();

executionRoutes.get(
  "/",
  validate(submitCodeSchema),
  authMiddleware,
  executeCode
);

export default executionRoutes;
