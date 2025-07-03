import {Router} from "express";
import {getCodeReview} from "../controllers/codereview.controllers";

const codeReviewRoutes = Router();
codeReviewRoutes.post("/", getCodeReview);
export default codeReviewRoutes;
