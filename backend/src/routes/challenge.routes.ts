import {Router} from "express";
import {requireAnyAuth} from "../middlewares/role.middleware";
import {validate} from "../middlewares/validate.middleware";
import {createChallengeSchema} from "../validations/challenge";
import {
  createChallenge,
  joinChallenge,
  getChallenge,
  leaveChallenge,
  getUserChallenges,
} from "../controllers/challenge.controllers";

const router = Router();

router.post("/create", requireAnyAuth, validate(createChallengeSchema), createChallenge);
router.post("/join/:code", requireAnyAuth, joinChallenge);
router.post("/leave/:code", requireAnyAuth, leaveChallenge);
router.get("/my", requireAnyAuth, getUserChallenges);
router.get("/:code", requireAnyAuth, getChallenge);

export default router;
