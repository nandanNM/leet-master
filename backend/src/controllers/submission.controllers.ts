import {Request, Response} from "express";
import {db} from "../db";
import {submissionsTable} from "../db/schema";
import {and, count, desc, eq, gte, sql} from "drizzle-orm";
import {ApiResponse, ApiError} from "../utils/responses";
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
      orderBy: (submissionsTable, {desc}) => [desc(submissionsTable.createdAt)],
    });

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
      where: and(
        eq(submissionsTable.userId, userId),
        eq(submissionsTable.problemId, problemId),
      ),
      orderBy: [desc(submissionsTable.createdAt)],
    });
    console.log(submissions);

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

    const submissions = await db.query.submissionsTable.findMany({
      where: (submissionsTable, {eq}) =>
        eq(submissionsTable.problemId, problemId),
      columns: {
        status: true,
      },
    });
    const submissionCount = submissions.length;
    const acceptedCount = submissions.filter(
      (submission) => submission.status === "ACCEPTED",
    ).length;

    const successRate =
      submissionCount > 0
        ? Math.round((acceptedCount / submissionCount) * 100)
        : 0;
    const data = {
      submissionCount,
      successRate,
    };

    new ApiResponse(200, "Submission count fetched successfully", data).send(
      res,
    );
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

    const submissions = await db.query.submissionsTable.findMany({
      where: (submissionsTable, {eq}) => eq(submissionsTable.userId, userId),
      columns: {
        status: true,
        problemId: true,
        language: true,
        createdAt: true,
      },
    });

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

    const stats = {
      total: submissions.length,
      accepted: 0,
      byLanguage: {} as Record<string, number>,
      solvedProblems: new Set<string>(),
    };
    for (const sub of submissions) {
      stats.byLanguage[sub.language] =
        (stats.byLanguage[sub.language] || 0) + 1;
      if (sub.status === "ACCEPTED") {
        stats.accepted++;
        stats.solvedProblems.add(sub.problemId);
      }
    }

    const successRate =
      stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;

    const mostUsedLanguage =
      Object.entries(stats.byLanguage).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "N/A";
    const totalLanguagesUsed = Object.keys(stats.byLanguage).length;

    const dashboardStats = {
      totalSubmissions: stats.total,
      submissionsLast24Hours,
      problemsSolved: stats.solvedProblems.size,
      totalSuccesses: stats.accepted,
      successRate,
      totalLanguagesUsed,
      mostUsedLanguage,
    };

    new ApiResponse(
      200,
      "User submission stats fetched successfully",
      dashboardStats,
    ).send(res);
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
