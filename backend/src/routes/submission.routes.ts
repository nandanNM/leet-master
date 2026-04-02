import {Router} from "express";
import {requireAnyAuth} from "../middlewares/role.middleware";
import {
  getAllSubmissions,
  getAllSubmissionCount,
  getAllSubmissionByProblemId,
  // getAllSubmissionStats,
  // getSubmissionHeatMap,
} from "../controllers/submission.controllers";

const submissionRoutes = Router();
submissionRoutes.get("/get-all-submissions", requireAnyAuth, getAllSubmissions);
submissionRoutes.get(
  "/get-submissions/:id",
  requireAnyAuth,
  getAllSubmissionByProblemId,
);
submissionRoutes.get(
  "/get-submissions-count/:id",
  requireAnyAuth,
  getAllSubmissionCount,
);
// submissionRoutes.get(
//   "/submission-stats",
//   requireAnyAuth,
//   getAllSubmissionStats,
// );
// submissionRoutes.get("/heatmap", requireAnyAuth, getSubmissionHeatMap);
export default submissionRoutes;
