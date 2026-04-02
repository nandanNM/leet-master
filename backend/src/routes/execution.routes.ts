import {Router} from "express";
import {validate} from "../middlewares/validate.middleware";
import {SubmitCodeSchema} from "../validations/submit-code";
import {requireAnyAuth} from "../middlewares/role.middleware";
import {runCode, submitCode} from "../controllers/execute-code.controllers";

const executionRoutes = Router();

executionRoutes.post(
  "/submit-code",
  validate(SubmitCodeSchema),
  requireAnyAuth,
  submitCode,
);
executionRoutes.post(
  "/run-code",
  validate(SubmitCodeSchema),
  requireAnyAuth,
  runCode,
);

export default executionRoutes;
