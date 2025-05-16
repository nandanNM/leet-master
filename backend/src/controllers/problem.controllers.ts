import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { Problem } from "../schemas/problem";
import { ApiResponse, errorResponse } from "../utils/responses";
import {
  getJudge0LanguageCode,
  pullBatchResults,
  submitBatch,
} from "../utils/lib/judge0";
import { problamsTable } from "../db/schema";
export async function createProblem(
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
  if (req.user.role !== "ADMIN") {
    return new ApiResponse(
      403,
      false,
      "You are not authorized to create a problem"
    ).send(res);
  }
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageCode(language);
      console.log("Language ID:", languageId, typeof languageId);
      if (!languageId) {
        return new ApiResponse(
          400,
          false,
          `Language ${language} is not supported`
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
            false,
            `Test case ${i + 1} failed: ${result.status.description}`
          ).send(res);
        }
      }
    }
    // Save the problem to the database
    const problem = await db.insert(problamsTable).values({
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
    return new ApiResponse(
      200,
      null,
      "Problem created successfully.",
      true
    ).send(res);
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
  res: Response,
  next: NextFunction
): Promise<any> {}
export async function getProblemById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {}
export async function updateProblem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {}
export async function deleteProblem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {}

export async function getAllProblemsSolvedByUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {}
