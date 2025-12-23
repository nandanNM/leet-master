import {Router} from "express";
import {getCodeReview} from "../controllers/codereview.controllers";
import {validate} from "../middlewares/validate.middleware";
import {codeReviewSchema} from "../schemas/review";
import {authMiddleware} from "src/middlewares/auth.middleware";

const codeReviewRoutes = Router();
codeReviewRoutes.post(
  "/",
  // validate(codeReviewSchema),
  // authMiddleware,
  getCodeReview,
);
export default codeReviewRoutes;
