import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { Problem } from "../schemas/problem";
import { ApiResponse, errorResponse } from "../utils/responses";
import {
  getJudge0LanguageCode,
  pullBatchResults,
  submitBatch,
} from "../utils/lib/judge0";
import { problemsTable } from "../db/schema";
import { eq } from "drizzle-orm";
export async function createProblem(req: Request, res: Response): Promise<any> {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body as Problem;
  if (req.user.role !== "ADMIN") {
    return new ApiResponse(
      403,
      "You are not authorized to create a problem",
      false
    ).send(res);
  }
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageCode(language);
      console.log("Language ID:", languageId, typeof languageId);
      if (!languageId) {
        return new ApiResponse(
          400,
          `Language ${language} is not supported`,
          false
        ).send(res);
      }
      const submissions = testcases.map(
        ({ input, output }: { input: string; output: string }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        })
      );
      console.log("Submission:", submissions);
      const submissionResult = await submitBatch(submissions);
      console.log("Submission result:", submissionResult);
      const tokens = submissionResult.map((result) => result.token);
      const results = await pullBatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return new ApiResponse(
            400,
            `Test case ${i + 1} failed: ${result.status.description}`,
            false
          ).send(res);
        }
      }
    }
    // Save the problem to the database
    const problem = await db.insert(problemsTable).values({
      userId: req.user.id,
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testcases,
      codeSnippets,
      referenceSolutions,
    });
    console.log("Problem created:", problem);
    return new ApiResponse(201, "Problem created successfully.", true).send(
      res
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function getAllProblems(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const problems = await db.query.problemsTable.findMany();

    if (!problems) {
      return new ApiResponse(404, "No problems found", false).send(res);
    }
    // console.log("Problems: find many", problems);
    return new ApiResponse(
      200,
      "Problems fetched successfully",
      true,
      problems
    ).send(res);
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
export async function getProblemById(
  req: Request,
  res: Response
): Promise<any> {
  const { id } = req.params;
  if (!id) {
    return new ApiResponse(400, "Problem ID is required", false).send(res);
  }
  try {
    const problem = await db.query.problemsTable.findFirst({
      where: (problemsTable, { eq }) => eq(problemsTable.id, id),
    });
    if (!problem) {
      return new ApiResponse(404, "Problem not found", false).send(res);
    }
    return new ApiResponse(
      200,
      "Problem fetched successfully",
      true,
      problem
    ).send(res);
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
export async function updateProblem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body as Problem;
  const { id } = req.params;
  if (!id) {
    return new ApiResponse(400, "Problem ID is required", false).send(res);
  }
  if (req.user.role !== "ADMIN") {
    return new ApiResponse(
      403,
      "You are not authorized to create a problem",
      false
    ).send(res);
  }
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageCode(language);
      console.log("Language ID:", languageId, typeof languageId);
      if (!languageId) {
        return new ApiResponse(
          400,
          `Language ${language} is not supported`,
          false
        ).send(res);
      }
      const submission = testcases.map(
        ({ input, output }: { input: string; output: string }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        })
      );
      console.log("Submission:", submission);
      const submissionResult = await submitBatch(submission);
      console.log("Submission result:", submissionResult);
      const tokens = submissionResult.map((result) => result.token);
      const results = await pullBatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return new ApiResponse(
            400,
            `Test case ${i + 1} failed: ${result.status.description}`,
            false
          ).send(res);
        }
      }
    }
    // Update the problem in the database
    const updatedProblem = await db
      .update(problemsTable)
      .set({
        userId: req.user.id,
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints,
        editorial,
        testcases,
        codeSnippets,
        referenceSolutions,
      })
      .where(eq(problemsTable.id, id))
      .returning();
    return new ApiResponse(
      201,
      "Problem updated successfully.",
      true,
      updatedProblem
    ).send(res);
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
export async function deleteProblem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const { id } = req.params;
  if (!id) {
    return new ApiResponse(400, "Problem ID is required", false).send(res);
  }
  if (req.user.role !== "ADMIN") {
    return new ApiResponse(
      403,
      "You are not authorized to create a problem",
      false
    ).send(res);
  }
  try {
    const deletedProblem = await db
      .delete(problemsTable)
      .where(eq(problemsTable.id, id));

    if (!deletedProblem) {
      return new ApiResponse(404, "Problem not found", false).send(res);
    }
    return new ApiResponse(200, "Problem deleted successfully", true).send(res);
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export async function getAllProblemsSolvedByUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {}
