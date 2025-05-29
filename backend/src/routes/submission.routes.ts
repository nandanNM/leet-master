import {Router} from "express";
import {authMiddleware} from "../middlewares/auth.middleware";
import {get} from "http";
import {
  getAllSubmissions,
  getAllSubmissionCount,
  getAllSubmissionByProblemId,
  getAllSubmissionStats,
  getSubmissionHeatMap,
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
submissionRoutes.get(
  "/submission-stats",
  authMiddleware,
  getAllSubmissionStats,
);
submissionRoutes.get("/heatmap", authMiddleware, getSubmissionHeatMap);
export default submissionRoutes;
