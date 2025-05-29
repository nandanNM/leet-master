import {Request, Response} from "express";
import {db} from "../db";
import {submissionsTable} from "../db/schema";
import {and, count, eq, gte, sql} from "drizzle-orm";
import {ApiResponse, ApiError, errorResponse} from "../utils/responses";
import {asyncHandler} from "../utils/async-handler";
import {isAuthenticated} from "../utils/auth";

export const getAllSubmissions = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }

    const {id: userId} = req.user;
    console.log("userId", userId);
    const submissions = await db.query.submissionsTable.findMany({
      where: (submissionsTable, {eq}) => eq(submissionsTable.userId, userId),
      orderBy: (submissionsTable, {desc}) => [desc(submissionsTable.createdAt)],
    });
    console.log("submissions", submissions);

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

export const getAllSubmissionStats = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const {id: userId} = req.user;
    if (!userId) {
      throw new ApiError(400, "User ID is required", "MISSING_USER_ID");
    }

    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Total submissions
    const totalResult = await db
      .select({count: count()})
      .from(submissionsTable)
      .where(eq(submissionsTable.userId, userId));

    const totalSubmissions = Number(totalResult[0]?.count || 0);

    // Submissions in the last 24 hours
    const last24hResult = await db
      .select({count: count()})
      .from(submissionsTable)
      .where(
        and(
          eq(submissionsTable.userId, userId),
          gte(submissionsTable.createdAt, last24Hours),
        ),
      );

    const submissionsLast24Hours = Number(last24hResult[0]?.count || 0);

    new ApiResponse(200, "User submission stats fetched successfully", {
      totalSubmissions,
      submissionsLast24Hours,
    }).send(res);
  },
);
export const getSubmissionHeatMap = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const {id: userId} = req.user;
    if (!userId) {
      throw new ApiError(400, "User ID is required", "MISSING_USER_ID");
    }

    const result = await db
      .select({
        date: sql<string>`DATE(${submissionsTable.createdAt})`.as("date"),
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(submissionsTable)
      .where(eq(submissionsTable.userId, userId))
      .groupBy(sql`DATE(${submissionsTable.createdAt})`)
      .orderBy(sql`DATE(${submissionsTable.createdAt})`);

    const formatted = result.map((r) => ({
      date: r.date,
      count: Number(r.count),
    }));

    new ApiResponse(
      200,
      "User submission heatmap data fetched successfully",
      formatted,
    ).send(res);
  },
);
