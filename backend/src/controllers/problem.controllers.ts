import {Request, Response, NextFunction, RequestHandler} from "express";
import {db} from "../db";
import {ApiResponse, ApiError, errorResponse} from "../utils/responses.utils";
import {
  getJudge0LanguageCode,
  pullBatchResults,
  submitBatch,
} from "../utils/judge0.utils";
import {eq, sql} from "drizzle-orm";
import {isAuthenticated} from "../utils/auth.utils";
import {asyncHandler} from "../utils/async-handler.utils";
import {CreateProblem} from "src/validations";
import {problem, problemTestCase} from "src/db/schema";

export const createProblem = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      description,
      difficulty,
      examples,
      constraints,
      hints,
      memoryLimit,
      timeLimit,
      testCases,
      slug,
      editorialCode,
      videoUrl,
      codeSnippets,
      referenceSolutions,
      driverCode,
    } = req.body as CreateProblem;

    // Authentication check
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }

    // Validate reference solutions
    if (!referenceSolutions || typeof referenceSolutions !== "object") {
      throw new ApiError(
        400,
        "Reference solutions are missing or invalid",
        "MISSING_REFERENCE_SOLUTIONS",
      );
    }

    // Validate and test reference solutions against testcases
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageCode(language);
      if (!languageId) {
        throw new ApiError(
          400,
          `Language ${language} is not supported`,
          "UNSUPPORTED_LANGUAGE",
        );
      }

      // If driverCode is provided for this language, wrap the solution inside it
      const driver = driverCode?.[language];
      const finalCode = driver
        ? driver.replace("{{USER_CODE}}", solutionCode)
        : solutionCode;

      const submissions = testCases.map(
        ({input, expectedOutput}: {input: string; expectedOutput: string}) => ({
          source_code: finalCode,
          language_id: languageId,
          stdin: input.trim(),
          expected_output: expectedOutput,
        }),
      );

      const submissionResult = await submitBatch(submissions);
      const tokens = submissionResult.map((result) => result.token);
      const results = await pullBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const actual = (result.stdout || "").trim();
        const expected = testCases[i].expectedOutput.trim();
        if (result.status.id !== 3) {
          console.log("Expected Output:", testCases[i].expectedOutput);
          console.log("Actual Output (stdout):", result.stdout);
          console.log("Status Description:", result.status.description);
          console.log("Compile Output:", result.compile_output);
          console.log("stderr:", result.stderr);
          throw new ApiError(
            400,
            `Test case ${i + 1} failed: ${result.status.description}${result.compile_output ? " — " + result.compile_output : ""}${result.stderr ? " — " + result.stderr : ""}`,
            "TEST_CASE_FAILED",
          );
        }
        if (
          result.status.id === 4 &&
          result.stdout.trim() !== testCases[i].expectedOutput.trim()
        ) {
          throw new ApiError(
            400,
            `Test case ${i + 1} failed: Wrong Answer (Output Mismatch)`,
            "TEST_CASE_FAILED",
          );
        }
        if (actual !== expected) {
          throw new ApiError(
            400,
            `Test case ${i + 1} failed: Wrong Answer (Output Mismatch)`,
            "TEST_CASE_FAILED",
          );
        }
      }
    }

    // Insert problem and return the created record
    const [createdProblem] = await db
      .insert(problem)
      .values({
        userId: req.user.id,
        title,
        description,
        difficulty,
        examples,
        constraints,
        hints,
        codeSnippets,
        referenceSolutions,
        driverCode,
        memoryLimit,
        slug,
        editorialCode,
        timeLimit,
        videoUrl,
      })
      .returning();

    if (!createdProblem) {
      throw new ApiError(500, "Failed to create problem", "INTERNAL_ERROR");
    }
    const testCaseRows = testCases.map((tc: any, index: number) => ({
      problemId: createdProblem.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isSample: tc.isSample ?? false,
      order: tc.order ?? index + 1,
    }));

    await db.insert(problemTestCase).values(testCaseRows);

    new ApiResponse(201, "Problem created successfully", {
      problemId: createdProblem.id,
    }).send(res);
  },
);

// export const getAllProblems = asyncHandler(
//   async (req: Request, res: Response) => {
//     const userId = req.user?.id;
//     if (!userId) {
//       throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");
//     }
//     const problems = await db.query.problemTable.findMany({
//       with: {
//         solvedBy: {
//           where: (solvedProblemTable, {eq}) =>
//             eq(solvedProblemTable.userId, userId),
//           columns: {id: true},
//         },
//       },
//     });
//     const problemsWithStatus = problems.map((problem) => ({
//       ...problem,
//       isSolved: problem.solvedBy.length > 0,
//     }));

//     if (!problemsWithStatus.length) {
//       throw new ApiError(404, "No problems found", "NOT_FOUND");
//     }
//     new ApiResponse(
//       200,
//       "Problems fetched successfully",
//       problemsWithStatus,
//     ).send(res);
//   },
// );

// export const getProblemById = asyncHandler(
//   async (req: Request, res: Response) => {
//     const {id} = req.params;
//     if (!id) {
//       throw new ApiError(400, "Problem ID is required", "MISSING_ID");
//     }

//     const problem = await db.query.problemTable.findFirst({
//       where: (problemTable, {eq}) => eq(problemTable.id, id as string),
//     });

//     if (!problem) {
//       throw new ApiError(404, "Problem not found", "NOT_FOUND");
//     }

//     new ApiResponse(200, "Problem fetched successfully", problem).send(res);
//   },
// );

// export const updateProblem = asyncHandler(
//   async (req: Request, res: Response) => {
//     const {
//       title,
//       description,
//       difficulty,
//       tags,
//       examples,
//       constraints,
//       hints,
//       editorial,
//       testcases,
//       codeSnippets,
//       referenceSolutions,
//     } = req.body as Problem;
//     const {id} = req.params;
//     if (!isAuthenticated(req)) {
//       throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
//     }
//     if (!id) {
//       throw new ApiError(400, "Problem ID is required", "MISSING_ID");
//     }

//     if (req.user.role !== "ADMIN") {
//       throw new ApiError(
//         403,
//         "You are not authorized to update a problem",
//         "UNAUTHORIZED",
//       );
//     }

//     for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
//       const languageId = getJudge0LanguageCode(language);
//       if (!languageId) {
//         throw new ApiError(
//           400,
//           `Language ${language} is not supported`,
//           "UNSUPPORTED_LANGUAGE",
//         );
//       }

//       const submission = testcases.map(
//         ({input, output}: {input: string; output: string}) => ({
//           source_code: solutionCode,
//           language_id: languageId,
//           stdin: input,
//           expected_output: output,
//         }),
//       );

//       const submissionResult = await submitBatch(submission);
//       const tokens = submissionResult.map((result) => result.token);
//       const results = await pullBatchResults(tokens);

//       for (let i = 0; i < results.length; i++) {
//         const result = results[i];
//         if (result.status.id !== 3) {
//           throw new ApiError(
//             400,
//             `Test case ${i + 1} failed: ${result.status.description}`,
//             "TEST_CASE_FAILED",
//           );
//         }
//       }
//     }

//     const [updatedProblem] = await db
//       .update(problemTable)
//       .set({
//         userId: req.user.id,
//         title,
//         description,
//         difficulty,
//         tags,
//         examples,
//         constraints,
//         hints,
//         editorial,
//         testcases,
//         codeSnippets,
//         referenceSolutions,
//       })
//       .where(eq(problemTable.id, id as string))
//       .returning(); // Returns an array of updated rows

//     new ApiResponse(200, "Problem updated successfully", updatedProblem).send(
//       res,
//     );
//   },
// );

// export const deleteProblem = asyncHandler(
//   async (req: Request, res: Response) => {
//     const {id} = req.params;
//     if (!isAuthenticated(req)) {
//       throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
//     }
//     if (!id) {
//       throw new ApiError(400, "Problem ID is required", "MISSING_ID");
//     }

//     if (req.user.role !== "ADMIN") {
//       throw new ApiError(
//         403,
//         "You are not authorized to delete a problem",
//         "UNAUTHORIZED",
//       );
//     }

//     const deletedRows = await db
//       .delete(problemTable)
//       .where(eq(problemTable.id, id as string))
//       .returning(); // Returns an array of deleted rows

//     if (!deletedRows.length) {
//       throw new ApiError(404, "Problem not found", "NOT_FOUND");
//     }

//     new ApiResponse(200, "Problem deleted successfully").send(res);
//   },
// );

// export const getAllProblemsSolvedByUser = asyncHandler(
//   async (req: Request, res: Response) => {
//     if (!isAuthenticated(req)) {
//       throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
//     }
//     const {id: userId} = req.user;

//     const solvedProblems = await db.query.solvedProblemTable.findMany({
//       where: (solvedProblemTable, {eq}) =>
//         eq(solvedProblemTable.userId, userId),
//       with: {
//         problem: true,
//       },
//     });

//     if (!solvedProblems.length) {
//       throw new ApiError(404, "No problems found", "NOT_FOUND");
//     }

//     new ApiResponse(200, "Problems fetched successfully", solvedProblems).send(
//       res,
//     );
//   },
// );

// export const getUserSolvedRank = asyncHandler(
//   async (req: Request, res: Response) => {
//     if (!isAuthenticated(req)) {
//       throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
//     }

//     const {id: userId} = req.params;
//     if (!userId) {
//       throw new ApiError(400, "User ID is required", "BAD_REQUEST");
//     }

//     // Get user solved count and rank
//     const userRankResult = await db.execute(
//       sql`
//         SELECT user_id, solvedCount, rank FROM (
//           SELECT
//             user_id,
//             COUNT(problem_id) AS solvedCount,
//             RANK() OVER (ORDER BY COUNT(problem_id) DESC) AS rank
//           FROM solved_problems
//           GROUP BY user_id
//         ) AS ranking
//         WHERE user_id = ${userId}
//       `,
//     );

//     // Get max rank (highest rank number)
//     const maxRankResult = await db.execute(
//       sql`
//         SELECT MAX(rank) AS maxRank FROM (
//           SELECT
//             user_id,
//             RANK() OVER (ORDER BY COUNT(problem_id) DESC) AS rank
//           FROM solved_problems
//           GROUP BY user_id
//         ) AS ranks
//       `,
//     );

//     const maxRankRow = maxRankResult.rows[0] as
//       | Record<string, unknown>
//       | undefined;
//     let maxRank = 0;
//     if (maxRankRow) {
//       const val = maxRankRow["maxrank"] ?? maxRankRow["maxRank"];
//       if (typeof val === "number") {
//         maxRank = val;
//       } else if (typeof val === "string") {
//         maxRank = Number(val);
//       }
//     }
//     if (!userRankResult.rows.length) {
//       new ApiResponse(200, "User has not solved any problems", {
//         solvedCount: 0,
//         rank: maxRank + 1,
//       }).send(res);
//     }

//     const {solvedCount, rank} = userRankResult.rows[0] as {
//       solvedCount: number;
//       rank: number;
//     };

//     new ApiResponse(200, "Rank fetched", {solvedCount, rank}).send(res);
//   },
// );
