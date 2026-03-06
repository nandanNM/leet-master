import {Router} from "express";
import {executeCode, runCode} from "../controllers/execute-code.controllers";
import {validate} from "../middlewares/validate.middleware";
import {SubmitCodeSchema} from "../validations/submit-code";
import {requireAnyAuth} from "../middlewares/role.middleware";

const executionRoutes = Router();

executionRoutes.post(
  "/submit-code",
  validate(SubmitCodeSchema),
  requireAnyAuth,
  executeCode,
);
executionRoutes.post(
  "/run-code",
  validate(SubmitCodeSchema),
  requireAnyAuth,
  runCode,
);

export default executionRoutes;
