import { Request, Response } from "express";
import { ApiResponse, errorResponse } from "../utils/responses";
import { db } from "../db";
import { submissionsTable } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getAllSubmissions(
  req: Request,
  res: Response
): Promise<any> {
  const { id: userId } = req.user;
  try {
    const submissions = await db.query.submissionsTable.findMany({
      where: (submissionsTable, { eq }) => eq(submissionsTable.userId, userId),
    });
    if (!submissions || submissions.length === 0) {
      return new ApiResponse(404, "No submissions found", false);
    }
    return new ApiResponse(
      200,
      "Submissions fetched successfully",
      true,
      submissions
    ).send(res);
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
export async function getSubmissionByProblemId(
  req: Request,
  res: Response
): Promise<any> {
  const { id: userId } = req.user;
  const { problemId } = req.params;
  if (!problemId) {
    return new ApiResponse(400, "Problem ID is required", false).send(res);
  }

  try {
    const submissions = await db.query.submissionsTable.findMany({
      where: (submissionsTable, { eq }) =>
        eq(submissionsTable.userId, userId) &&
        eq(submissionsTable.problemId, problemId),
    });
    if (!submissions || submissions.length === 0) {
      return new ApiResponse(404, "No submissions found", false);
    }
    return new ApiResponse(
      200,
      "Submissions fetched successfully",
      true,
      submissions
    ).send(res);
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
export async function getAllSubmissionCount(
  req: Request,
  res: Response
): Promise<any> {
  const { problemId } = req.params;
  if (!problemId) {
    return new ApiResponse(400, "Problem ID is required", false).send(res);
  }
  try {
    const submissionCount = await db.$count(
      submissionsTable,
      eq(submissionsTable.problemId, problemId)
    );
    return new ApiResponse(
      200,
      "Submission count fetched successfully",
      true,
      submissionCount
    ).send(res);
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
