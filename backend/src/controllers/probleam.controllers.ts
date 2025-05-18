import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { Probleam } from "../schemas/probleam";
import { ApiResponse, errorResponse } from "../utils/responses";
import {
  getJudge0LanguageCode,
  pullBatchResults,
  submitBatch,
} from "../utils/lib/judge0";
import { probleamsTable } from "../db/schema";
import { eq } from "drizzle-orm";
export async function createProbleam(
  req: Request,
  res: Response
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
  } = req.body as Probleam;
  if (req.user.role !== "ADMIN") {
    return new ApiResponse(
      403,
      "You are not authorized to create a probleam",
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
    // Save the probleam to the database
    const probleam = await db.insert(probleamsTable).values({
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
    console.log("Probleam created:", probleam);
    return new ApiResponse(201, "Probleam created successfully.", true).send(
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

export async function getAllProbleams(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const probleams = await db.query.probleamsTable.findMany();

    if (!probleams) {
      return new ApiResponse(404, "No probleams found", false).send(res);
    }
    // console.log("Probleams: find many", probleams);
    return new ApiResponse(
      200,
      "Probleams fetched successfully",
      true,
      probleams
    ).send(res);
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
export async function getProbleamById(
  req: Request,
  res: Response
): Promise<any> {
  const { id } = req.params;
  if (!id) {
    return new ApiResponse(400, "Probleam ID is required", false).send(res);
  }
  try {
    const probleam = await db.query.probleamsTable.findFirst({
      where: (probleamsTable, { eq }) => eq(probleamsTable.id, id),
    });
    if (!probleam) {
      return new ApiResponse(404, "Probleam not found", false).send(res);
    }
    return new ApiResponse(
      200,
      "Probleam fetched successfully",
      true,
      probleam
    ).send(res);
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
export async function updateProbleam(
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
  } = req.body as Probleam;
  const { id } = req.params;
  if (!id) {
    return new ApiResponse(400, "Probleam ID is required", false).send(res);
  }
  if (req.user.role !== "ADMIN") {
    return new ApiResponse(
      403,
      "You are not authorized to create a probleam",
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
    // Update the probleam in the database
    const updatedProbleam = await db
      .update(probleamsTable)
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
      .where(eq(probleamsTable.id, id))
      .returning();
    return new ApiResponse(
      201,
      "Probleam updated successfully.",
      true,
      updatedProbleam
    ).send(res);
  } catch (error) {
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
export async function deleteProbleam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const { id } = req.params;
  if (!id) {
    return new ApiResponse(400, "Probleam ID is required", false).send(res);
  }
  if (req.user.role !== "ADMIN") {
    return new ApiResponse(
      403,
      "You are not authorized to create a probleam",
      false
    ).send(res);
  }
  try {
    const deletedProbleam = await db
      .delete(probleamsTable)
      .where(eq(probleamsTable.id, id));

    if (!deletedProbleam) {
      return new ApiResponse(404, "Probleam not found", false).send(res);
    }
    return new ApiResponse(200, "Probleam deleted successfully", true).send(
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

export async function getAllProbleamsSolvedByUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {}
