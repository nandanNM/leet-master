import {Request, Response} from "express";
import {db} from "../db";
import {ApiResponse, ApiError} from "../utils/responses.utils";
import {eq, and, sql} from "drizzle-orm";
import {isAuthenticated} from "../utils/auth.utils";
import {asyncHandler} from "../utils/async-handler.utils";
import {
  challenge,
  challengeParticipant,
  challengeInvitation,
} from "src/db/schema";
import {CreateChallenge, requiredId} from "../validations";
import crypto from "crypto";
import {validateData} from "src/middlewares/validate.middleware";

export const createChallenge = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      problemId,
      title,
      expiresAt,
      invitedUserIds = [],
      invitedEmails = [], // New field for email invites
      durationMinutes,
      startsAt, // Optional: if provided, it's scheduled. If null, starts on trigger.
    } = req.body as CreateChallenge;

    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }

    const creatorId = req.user.id;

    // 1. Create the Challenge Record
    // If startsAt is provided, we calculate endsAt immediately
    const startDateTime = startsAt ? new Date(startsAt) : null;
    const endDateTime =
      startDateTime && durationMinutes
        ? new Date(startDateTime.getTime() + durationMinutes * 60000)
        : null;

    const [newChallenge] = await db
      .insert(challenge)
      .values({
        creatorId,
        problemId,
        title: title || "New Challenge",
        status: "PENDING",
        expiresAt: new Date(expiresAt),
        startsAt: startDateTime,
        endsAt: endDateTime,
      })
      .returning();

    if (!newChallenge) {
      throw new ApiError(500, "Failed to create challenge", "INTERNAL_ERROR");
    }

    // 2. Add Creator as an ACCEPTED participant immediately
    const participantsData = [
      {
        challengeId: newChallenge.id,
        userId: creatorId,
        status: "ACCEPTED" as const,
      },
      ...invitedUserIds.map((userId: string) => ({
        challengeId: newChallenge.id,
        userId: userId,
        status: "INVITED" as const,
      })),
    ];

    await db.insert(challengeParticipant).values(participantsData);

    // 3. Handle External Email Invitations
    if (invitedEmails.length > 0) {
      const emailInvites = invitedEmails.map((email) => ({
        challengeId: newChallenge.id,
        email,
        token: crypto.randomBytes(32).toString("hex"),
        expiresAt: new Date(expiresAt),
      }));
      await db.insert(challengeInvitation).values(emailInvites);

      // Logic to trigger your email service would go here
      //TODO: email function come hare
    }

    new ApiResponse(201, "Challenge created and invites sent", {
      challengeId: newChallenge.id,
      startsAt: newChallenge.startsAt,
    }).send(res);
  },
);

export const startChallenge = asyncHandler(
  async (req: Request, res: Response) => {
    const {id: challengeId} = validateData(requiredId, req.params);
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const userId = req.user.id as string;

    const target = await db.query.challenge.findFirst({
      where: eq(challenge.id, challengeId),
    });

    if (!target) throw new ApiError(404, "Challenge not found", "NOT_FOUND");
    if (target.creatorId !== userId)
      throw new ApiError(
        403,
        "Only the creator can start the match",
        "FORBIDDEN",
      );
    if (target.status !== "PENDING")
      throw new ApiError(
        400,
        "Challenge already started or finished",
        "BAD_REQUEST",
      );

    // Start immediately logic
    const startTime = new Date();
    // Use the durationMinutes logic (assuming you added it to schema or have it from creation)
    const duration = 20; // Default or fetch from target if you stored durationMinutes
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const [updated] = await db
      .update(challenge)
      .set({
        status: "ACTIVE",
        startsAt: startTime,
        endsAt: endTime,
      })
      .where(eq(challenge.id, challengeId))
      .returning();

    new ApiResponse(200, "Match has started!", updated).send(res);
  },
);

export const acceptEmailInvite = asyncHandler(
  async (req: Request, res: Response) => {
    //TODO: add validation
    const {token} = req.body;
    if (!isAuthenticated(req))
      throw new ApiError(
        401,
        "Login required to accept invite",
        "UNAUTHORIZED",
      );

    const invite = await db.query.challengeInvitation.findFirst({
      where: eq(challengeInvitation.token, token),
    });

    if (!invite || invite.status !== "PENDING") {
      throw new ApiError(
        404,
        "Invalid or already used invitation",
        "NOT_FOUND",
      );
    }

    if (new Date() > invite.expiresAt) {
      throw new ApiError(400, "Invitation link expired", "EXPIRED");
    }

    // Mark invite as accepted
    await db
      .update(challengeInvitation)
      .set({status: "ACCEPTED"})
      .where(eq(challengeInvitation.token, token));

    //  Add user to participants
    await db.insert(challengeParticipant).values({
      challengeId: invite.challengeId,
      userId: req.user.id,
      status: "ACCEPTED",
    });

    new ApiResponse(200, "Joined challenge successfully").send(res);
  },
);

export const sendMatchMessage = asyncHandler(
  async (req: Request, res: Response) => {
    // if need to save in db

    if (res.app.locals.broadcastMessageCreated) {
      res.app.locals.broadcastMessageCreated(req.body);
    }
    new ApiResponse(200, "Messages created").send(res);
  },
);
