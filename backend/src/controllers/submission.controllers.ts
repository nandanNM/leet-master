import {Request, Response} from "express";
import {db} from "../db";
import {submissionsTable} from "../db/schema";
import {eq} from "drizzle-orm";
import {ApiResponse, ApiError, errorResponse} from "../utils/responses";
import {asyncHandler} from "../utils/async-handler";
import {isAuthenticated} from "../utils/auth";

export const getAllSubmissions = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }

    const {id: userId} = req.user;
    const submissions = await db.query.submissionsTable.findMany({
      where: (submissionsTable, {eq}) => eq(submissionsTable.userId, userId),
    });

    if (!submissions || submissions.length === 0) {
      throw new ApiError(404, "No submissions found", "NOT_FOUND");
    }

    new ApiResponse(200, "Submissions fetched successfully", submissions).send(
      res,
    );
  },
);

export const getAllSubmissionByProblemId = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }

    const {id: userId} = req.user;
    const {problemId} = req.params;

    if (!problemId) {
      throw new ApiError(400, "Problem ID is required", "MISSING_PROBLEM_ID");
    }

    const submissions = await db.query.submissionsTable.findMany({
      where: (submissionsTable, {eq}) =>
        eq(submissionsTable.userId, userId) &&
        eq(submissionsTable.problemId, problemId),
      orderBy: (submissionsTable, {desc}) => [desc(submissionsTable.createdAt)],
    });

    if (!submissions || submissions.length === 0) {
      throw new ApiError(404, "No submissions found", "NOT_FOUND");
    }

    new ApiResponse(200, "Submissions fetched successfully", submissions).send(
      res,
    );
  },
);

export const getAllSubmissionCount = asyncHandler(
  async (req: Request, res: Response) => {
    const {problemId} = req.params;

    if (!problemId) {
      throw new ApiError(400, "Problem ID is required", "MISSING_PROBLEM_ID");
    }

    const submissionCount = await db.$count(
      submissionsTable,
      eq(submissionsTable.problemId, problemId),
    );
    console.log("Submission count:", submissionCount);

    new ApiResponse(
      200,
      "Submission count fetched successfully",
      submissionCount,
    ).send(res);
  },
);
