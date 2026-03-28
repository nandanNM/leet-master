import {Router} from "express";
import {isAuthenticated} from "../utils/auth.utils";
import {
  createChallenge,
  startChallenge,
  acceptEmailInvite,
} from "../controllers/match.controllers";
import {createChallengeSchema, acceptEmailInviteSchema} from "../validations";
import {validate} from "../middlewares/validate.middleware";

const matchRoutes = Router();

matchRoutes.post(
  "/",
  isAuthenticated,
  validate(createChallengeSchema),
  createChallenge,
);

// matchRoutes.patch(
//   "/respond",
//   isAuthenticated,
//   validate(respondChallengeSchema),
//   respondToChallenge,
// );
matchRoutes.post("/:challengeId/start", isAuthenticated, startChallenge);
matchRoutes.post(
  "/accept-invite",
  isAuthenticated,
  validate(acceptEmailInviteSchema),
  acceptEmailInvite,
);

// matchRoutes.get("/my-challenges", isAuthenticated, getMyChallenges);

export default matchRoutes;
