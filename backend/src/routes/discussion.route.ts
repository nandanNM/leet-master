import {Router} from "express";
import {
  createDiscussion,
  getAllDiscussionsForProblem,
} from "../controllers/discussion.controllers";
import {validate} from "../middlewares/validate.middleware";
import {DiscussionSchema} from "../validations/discussion";
import {requireAnyAuth} from "src/middlewares/role.middleware";

const discussionRoutes = Router();
discussionRoutes.post(
  "/create/:problemId",
  validate(DiscussionSchema),
  requireAnyAuth,
  createDiscussion,
);
discussionRoutes.get(
  "/:problemId",
  requireAnyAuth,
  getAllDiscussionsForProblem,
);

export default discussionRoutes;
