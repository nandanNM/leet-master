import {Router} from "express";
import {authMiddleware} from "../middlewares/auth.middleware";
import {get} from "http";
import {
  getAllSubmissions,
  getAllSubmissionCount,
  getAllSubmissionByProblemId,
} from "../controllers/submission.controllers";

const submissionRoutes = Router();
submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);
submissionRoutes.get(
  "/get-submissions/:problemId",
  authMiddleware,
  getAllSubmissionByProblemId,
);
submissionRoutes.get(
  "/get-submissions-count/:problemId",
  authMiddleware,
  getAllSubmissionCount,
);

export default submissionRoutes;
