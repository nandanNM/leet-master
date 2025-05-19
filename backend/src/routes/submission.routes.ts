import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { get } from "http";
import {
  getAllSubmissions,
  getSubmissionByProblemId,
  getAllSubmissionCount,
} from "../controllers/submission.controllers";

const submissionRoutes = Router();
submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);
submissionRoutes.get(
  "/get-submission/:problemId",
  authMiddleware,
  getSubmissionByProblemId
);
submissionRoutes.get(
  "/get-submission-count/:problemId",
  authMiddleware,
  getAllSubmissionCount
);

export default submissionRoutes;
