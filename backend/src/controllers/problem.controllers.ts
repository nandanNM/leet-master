import {Request, Response, NextFunction, RequestHandler} from "express";
import {db} from "../db";
import {Problem} from "../schemas/problem";
import {ApiResponse, ApiError, errorResponse} from "../utils/responses";
import {
  getJudge0LanguageCode,
  pullBatchResults,
  submitBatch,
} from "../utils/lib/judge0";
import {problemsTable} from "../db/schema";
import {eq, sql} from "drizzle-orm";
import {isAuthenticated} from "../utils/auth";
import {asyncHandler} from "../utils/async-handler";

export const createProblem = asyncHandler(
  async (req: Request, res: Response) => {
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
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    if (req.user.role !== "ADMIN") {
      throw new ApiError(
        403,
        "You are not authorized to create a problem",
        "UNAUTHORIZED",
      );
    }
    if (!referenceSolutions || typeof referenceSolutions !== "object") {
      throw new ApiError(
        400,
        "Reference solutions are missing or invalid",
        "MISSING_REFERENCE_SOLUTIONS",
      );
    }
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageCode(language);
      if (!languageId) {
        throw new ApiError(
          400,
          `Language ${language} is not supported`,
          "UNSUPPORTED_LANGUAGE",
        );
      }

      const submissions = testcases.map(
        ({input, output}: {input: string; output: string}) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }),
      );

      const submissionResult = await submitBatch(submissions);
      const tokens = submissionResult.map((result) => result.token);
      const results = await pullBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          console.log("Expected Output:", testcases[i].output);
          console.log("Actual Output (stdout):", result.stdout);
          console.log("Status Description:", result.status.description);
          throw new ApiError(
            400,
            `Test case ${i + 1} failed: ${result.status.description}`,
            "TEST_CASE_FAILED",
          );
        }
        if (
          result.status.id === 4 &&
          result.stdout.trim() !== testcases[i].output.trim()
        ) {
          throw new ApiError(
            400,
            `Test case ${i + 1} failed: Wrong Answer (Output Mismatch)`,
            "TEST_CASE_FAILED",
          );
        }
      }
    }

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

    new ApiResponse(201, "Problem created successfully", problem).send(res);
  },
);

export const getAllProblems = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");
    }
    const problems = await db.query.problemsTable.findMany({
      with: {
        solvedBy: {
          where: (solvedProblemsTable, {eq}) =>
            eq(solvedProblemsTable.userId, userId),
          columns: {id: true},
        },
      },
    });
    const problemsWithStatus = problems.map((problem) => ({
      ...problem,
      isSolved: problem.solvedBy.length > 0,
    }));

    if (!problemsWithStatus.length) {
      throw new ApiError(404, "No problems found", "NOT_FOUND");
    }
    new ApiResponse(
      200,
      "Problems fetched successfully",
      problemsWithStatus,
    ).send(res);
  },
);

export const getProblemById = asyncHandler(
  async (req: Request, res: Response) => {
    const {id} = req.params;
    if (!id) {
      throw new ApiError(400, "Problem ID is required", "MISSING_ID");
    }

    const problem = await db.query.problemsTable.findFirst({
      where: (problemsTable, {eq}) => eq(problemsTable.id, id),
    });

    if (!problem) {
      throw new ApiError(404, "Problem not found", "NOT_FOUND");
    }

    new ApiResponse(200, "Problem fetched successfully", problem).send(res);
  },
);

export const updateProblem = asyncHandler(
  async (req: Request, res: Response) => {
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
    const {id} = req.params;
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    if (!id) {
      throw new ApiError(400, "Problem ID is required", "MISSING_ID");
    }

    if (req.user.role !== "ADMIN") {
      throw new ApiError(
        403,
        "You are not authorized to update a problem",
        "UNAUTHORIZED",
      );
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageCode(language);
      if (!languageId) {
        throw new ApiError(
          400,
          `Language ${language} is not supported`,
          "UNSUPPORTED_LANGUAGE",
        );
      }

      const submission = testcases.map(
        ({input, output}: {input: string; output: string}) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }),
      );

      const submissionResult = await submitBatch(submission);
      const tokens = submissionResult.map((result) => result.token);
      const results = await pullBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          throw new ApiError(
            400,
            `Test case ${i + 1} failed: ${result.status.description}`,
            "TEST_CASE_FAILED",
          );
        }
      }
    }

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

    new ApiResponse(200, "Problem updated successfully", updatedProblem).send(
      res,
    );
  },
);

export const deleteProblem = asyncHandler(
  async (req: Request, res: Response) => {
    const {id} = req.params;
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    if (!id) {
      throw new ApiError(400, "Problem ID is required", "MISSING_ID");
    }

    if (req.user.role !== "ADMIN") {
      throw new ApiError(
        403,
        "You are not authorized to delete a problem",
        "UNAUTHORIZED",
      );
    }

    const deletedProblem = await db
      .delete(problemsTable)
      .where(eq(problemsTable.id, id));

    if (!deletedProblem) {
      throw new ApiError(404, "Problem not found", "NOT_FOUND");
    }

    new ApiResponse(200, "Problem deleted successfully").send(res);
  },
);

export const getAllProblemsSolvedByUser = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const {id: userId} = req.user;

    const solvedProblems = await db.query.solvedProblemsTable.findMany({
      where: (solvedProblemsTable, {eq}) =>
        eq(solvedProblemsTable.userId, userId),
      with: {
        problem: true,
      },
    });

    if (!solvedProblems) {
      throw new ApiError(404, "No problems found", "NOT_FOUND");
    }

    new ApiResponse(200, "Problems fetched successfully", solvedProblems).send(
      res,
    );
  },
);

export const getUserSolvedRank = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }

    const {id: userId} = req.params;
    if (!userId) {
      throw new ApiError(400, "User ID is required", "BAD_REQUEST");
    }

    // Get user solved count and rank
    const userRankResult = await db.execute(
      sql`
        SELECT user_id, solvedCount, rank FROM (
          SELECT
            user_id,
            COUNT(problem_id) AS solvedCount,
            RANK() OVER (ORDER BY COUNT(problem_id) DESC) AS rank
          FROM solved_problems
          GROUP BY user_id
        ) AS ranking
        WHERE user_id = ${userId}
      `,
    );

    // Get max rank (highest rank number)
    const maxRankResult = await db.execute(
      sql`
        SELECT MAX(rank) AS maxRank FROM (
          SELECT
            user_id,
            RANK() OVER (ORDER BY COUNT(problem_id) DESC) AS rank
          FROM solved_problems
          GROUP BY user_id
        ) AS ranks
      `,
    );

    const maxRankRow = maxRankResult.rows[0] as
      | Record<string, unknown>
      | undefined;
    let maxRank = 0;
    if (maxRankRow) {
      const val = maxRankRow["maxrank"] ?? maxRankRow["maxRank"];
      if (typeof val === "number") {
        maxRank = val;
      } else if (typeof val === "string") {
        maxRank = Number(val);
      }
    }
    if (!userRankResult.rows.length) {
      new ApiResponse(200, "User has not solved any problems", {
        solvedCount: 0,
        rank: maxRank + 1,
      }).send(res);
    }

    const {solvedCount, rank} = userRankResult.rows[0] as {
      solvedCount: number;
      rank: number;
    };

    new ApiResponse(200, "Rank fetched", {solvedCount, rank}).send(res);
  },
);
