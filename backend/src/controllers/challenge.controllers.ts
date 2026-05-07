import {Request, Response} from "express";
import {and, count, eq} from "drizzle-orm";
import {db} from "../db";
import {
  challenge as challengeTable,
  challengeParticipant as challengeParticipantTable,
  problem as problemTable,
  user,
} from "../db/schema";
import {ApiResponse, ApiError} from "../utils/responses.utils";
import {isAuthenticated} from "../utils/auth.utils";
import {asyncHandler} from "../utils/async-handler.utils";
import type {CreateChallenge} from "../validations/challenge";

function generateChallengeCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export const createChallenge = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }

    const userId = req.user.id;
    const userName = (req.user as any).name as string;
    const {
      problemId,
      mode = "1v1",
      maxParticipants,
      durationSeconds = 3600,
    } = req.body as CreateChallenge;

    const problemRecord = await db
      .select({
        id: problemTable.id,
        title: problemTable.title,
        slug: problemTable.slug,
        difficulty: problemTable.difficulty,
      })
      .from(problemTable)
      .where(eq(problemTable.id, problemId))
      .then((rows) => rows[0]);

    if (!problemRecord) {
      throw new ApiError(404, "Problem not found", "PROBLEM_NOT_FOUND");
    }

    const maxP = mode === "1v1" ? 2 : (maxParticipants ?? 5);

    let code = generateChallengeCode();
    for (let i = 0; i < 5; i++) {
      const existing = await db
        .select({id: challengeTable.id})
        .from(challengeTable)
        .where(eq(challengeTable.code, code))
        .then((rows) => rows[0]);
      if (!existing) break;
      code = generateChallengeCode();
    }

    const [newChallenge] = await db
      .insert(challengeTable)
      .values({
        code,
        problemId,
        creatorId: userId,
        mode,
        maxParticipants: maxP,
        durationSeconds,
        status: "waiting",
      })
      .returning();

    // Creator automatically joins their own challenge
    await db.insert(challengeParticipantTable).values({
      challengeId: newChallenge.id,
      userId,
      status: "joined",
    });

    new ApiResponse(201, "Challenge created", {
      challenge: newChallenge,
      problem: problemRecord,
      shareCode: newChallenge.code,
    }).send(res);
  },
);

export const joinChallenge = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }

    const userId = req.user.id;
    const userName = (req.user as any).name as string;
    const code = (req.params.code as string).toUpperCase();

    const challengeRecord = await db
      .select()
      .from(challengeTable)
      .where(eq(challengeTable.code, code))
      .then((rows) => rows[0]);

    if (!challengeRecord) {
      throw new ApiError(404, "Challenge not found", "CHALLENGE_NOT_FOUND");
    }

    if (
      challengeRecord.status === "finished" ||
      challengeRecord.status === "cancelled"
    ) {
      throw new ApiError(400, "This challenge has already ended", "CHALLENGE_ENDED");
    }

    if (challengeRecord.status === "active") {
      throw new ApiError(
        400,
        "This challenge has already started",
        "CHALLENGE_ALREADY_STARTED",
      );
    }

    const existing = await db
      .select({id: challengeParticipantTable.id})
      .from(challengeParticipantTable)
      .where(
        and(
          eq(challengeParticipantTable.challengeId, challengeRecord.id),
          eq(challengeParticipantTable.userId, userId),
        ),
      )
      .then((rows) => rows[0]);

    if (existing) {
      throw new ApiError(
        409,
        "You have already joined this challenge",
        "ALREADY_JOINED",
      );
    }

    const [countResult] = await db
      .select({value: count()})
      .from(challengeParticipantTable)
      .where(eq(challengeParticipantTable.challengeId, challengeRecord.id));

    const currentCount = Number(countResult.value);

    if (currentCount >= challengeRecord.maxParticipants) {
      throw new ApiError(400, "Challenge room is full", "CHALLENGE_FULL");
    }

    await db.insert(challengeParticipantTable).values({
      challengeId: challengeRecord.id,
      userId,
      status: "joined",
    });

    const newCount = currentCount + 1;

    req.app.locals.broadcastChallengePlayerJoined?.(code, {
      userId,
      name: userName,
      participantCount: newCount,
      maxParticipants: challengeRecord.maxParticipants,
    });

    let updatedChallenge = challengeRecord;

    if (newCount >= challengeRecord.maxParticipants) {
      const startedAt = new Date();
      const endsAt = new Date(
        startedAt.getTime() + challengeRecord.durationSeconds * 1000,
      );

      [updatedChallenge] = await db
        .update(challengeTable)
        .set({status: "active", startedAt, endsAt})
        .where(eq(challengeTable.id, challengeRecord.id))
        .returning();

      const problemRecord = await db
        .select({
          id: problemTable.id,
          title: problemTable.title,
          slug: problemTable.slug,
        })
        .from(problemTable)
        .where(eq(problemTable.id, challengeRecord.problemId))
        .then((rows) => rows[0]);

      req.app.locals.broadcastChallengeStarted?.(code, {
        challengeId: challengeRecord.id,
        startedAt: startedAt.toISOString(),
        endsAt: endsAt.toISOString(),
        problem: problemRecord,
      });
    }

    new ApiResponse(200, "Joined challenge successfully", {
      challenge: updatedChallenge,
      participantCount: newCount,
    }).send(res);
  },
);

export const getChallenge = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }

    const code = (req.params.code as string).toUpperCase();

    const challengeRecord = await db
      .select()
      .from(challengeTable)
      .where(eq(challengeTable.code, code))
      .then((rows) => rows[0]);

    if (!challengeRecord) {
      throw new ApiError(404, "Challenge not found", "CHALLENGE_NOT_FOUND");
    }

    const participants = await db
      .select({
        id: challengeParticipantTable.id,
        userId: challengeParticipantTable.userId,
        name: user.name,
        image: user.image,
        status: challengeParticipantTable.status,
        rank: challengeParticipantTable.rank,
        finishedAt: challengeParticipantTable.finishedAt,
      })
      .from(challengeParticipantTable)
      .innerJoin(user, eq(challengeParticipantTable.userId, user.id))
      .where(eq(challengeParticipantTable.challengeId, challengeRecord.id));

    const problemRecord = await db
      .select({
        id: problemTable.id,
        title: problemTable.title,
        slug: problemTable.slug,
        difficulty: problemTable.difficulty,
      })
      .from(problemTable)
      .where(eq(problemTable.id, challengeRecord.problemId))
      .then((rows) => rows[0]);

    new ApiResponse(200, "Challenge details", {
      challenge: challengeRecord,
      problem: problemRecord,
      participants,
    }).send(res);
  },
);

export const leaveChallenge = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }

    const userId = req.user.id;
    const code = (req.params.code as string).toUpperCase();

    const challengeRecord = await db
      .select()
      .from(challengeTable)
      .where(eq(challengeTable.code, code))
      .then((rows) => rows[0]);

    if (!challengeRecord) {
      throw new ApiError(404, "Challenge not found", "CHALLENGE_NOT_FOUND");
    }

    if (challengeRecord.status === "active") {
      throw new ApiError(
        400,
        "Cannot leave a challenge that has already started",
        "CHALLENGE_ACTIVE",
      );
    }

    if (challengeRecord.creatorId === userId) {
      await db
        .update(challengeTable)
        .set({status: "cancelled"})
        .where(eq(challengeTable.id, challengeRecord.id));

      new ApiResponse(200, "Challenge cancelled").send(res);
    } else {
      await db
        .delete(challengeParticipantTable)
        .where(
          and(
            eq(challengeParticipantTable.challengeId, challengeRecord.id),
            eq(challengeParticipantTable.userId, userId),
          ),
        );

      new ApiResponse(200, "Left challenge").send(res);
    }
  },
);

export const getUserChallenges = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }

    const userId = req.user.id;

    const challenges = await db
      .select({
        challenge: challengeTable,
        problem: {
          id: problemTable.id,
          title: problemTable.title,
          slug: problemTable.slug,
          difficulty: problemTable.difficulty,
        },
        myStatus: challengeParticipantTable.status,
        myRank: challengeParticipantTable.rank,
      })
      .from(challengeParticipantTable)
      .innerJoin(
        challengeTable,
        eq(challengeParticipantTable.challengeId, challengeTable.id),
      )
      .innerJoin(problemTable, eq(challengeTable.problemId, problemTable.id))
      .where(eq(challengeParticipantTable.userId, userId))
      .orderBy(challengeTable.createdAt);

    new ApiResponse(200, "User challenges", challenges).send(res);
  },
);
