import {Router} from "express";
import {getCodeReview} from "../controllers/codereview.controllers";
import {validate} from "../middlewares/validate.middleware";
import {codeReviewSchema} from "../validations/review";
import {requireAnyAuth} from "src/middlewares/role.middleware";

const codeReviewRoutes = Router();
codeReviewRoutes.post(
  "/",
  validate(codeReviewSchema),
  requireAnyAuth,
  getCodeReview,
);
export default codeReviewRoutes;
