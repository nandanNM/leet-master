import {Router} from "express";
import {
  createDiscussion,
  getAllDiscussionsForProblem,
} from "../controllers/discussion.controllers";
import {authMiddleware} from "../middlewares/auth.middleware";
import {validate} from "../middlewares/validate.middleware";
import {DiscussionSchema} from "../schemas/discussion";

const discussionRoutes = Router();
discussionRoutes.post(
  "/create/:problemId",
  validate(DiscussionSchema),
  authMiddleware,
  createDiscussion,
);
discussionRoutes.get(
  "/:problemId",
  authMiddleware,
  getAllDiscussionsForProblem,
);

export default discussionRoutes;
