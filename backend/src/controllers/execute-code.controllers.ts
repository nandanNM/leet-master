import {Request, Response} from "express";
import {SubmitCode} from "../validations/submit-code";
import {
  getLanguage,
  pullBatchResults,
  submitBatch,
} from "../utils/judge0.utils";
import {db} from "../db";
import {
  solvedProblem as solvedProblemTable,
  submission as submissionTable,
  testCaseResult as testCaseResultTable,
  problem as problemTable,
} from "../db/schema";
import {ApiResponse, ApiError} from "../utils/responses.utils";
import {isAuthenticated} from "../utils/auth.utils";
import {asyncHandler} from "../utils/async-handler.utils";
import {eq} from "drizzle-orm";
import {buildFinalCode, mapJudgeResults} from "../utils/submission.utils";

export const submitCode = asyncHandler(async (req: Request, res: Response) => {
  if (!isAuthenticated(req))
    throw new ApiError(401, "Authentication required", "UNAUTHORIZED");

  const {source_code, language_id, stdin, expected_outputs, problemId} =
    req.body as SubmitCode;
  const {id: userId} = req.user;

  const lang = getLanguage(Number(language_id)).toLowerCase();
  const problemRecord = await db
    .select({driverCode: problemTable.driverCode})
    .from(problemTable)
    .where(eq(problemTable.id, problemId))
    .then((r) => r[0]);

  if (!problemRecord) throw new ApiError(404, "Problem not found", "NOT_FOUND");

  const finalCode = buildFinalCode(source_code, problemRecord.driverCode, lang);

  const judge0Response = await submitBatch(
    stdin.map((input) => ({
      source_code: finalCode,
      language_id: Number(language_id),
      stdin: input,
    })),
  );

  const results = await pullBatchResults(judge0Response.map((s) => s.token));
  const {testCases, allPassed, status, runtime, memory} = mapJudgeResults(
    results,
    expected_outputs,
  );

  const [submission] = await db
    .insert(submissionTable)
    .values({
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguage(Number(language_id)),
      status,
      runtime,
      memory,
      stdout: JSON.stringify(testCases.map((tc) => tc.stdout)),
      stderr: testCases.some((tc) => tc.stderr)
        ? JSON.stringify(testCases.map((tc) => tc.stderr))
        : null,
      compileOutput: testCases.some((tc) => tc.compileOutput)
        ? JSON.stringify(testCases.map((tc) => tc.compileOutput))
        : null,
    })
    .returning();

  await db.insert(testCaseResultTable).values(
    testCases.map((tc) => ({
      submissionId: submission.id,
      passed: tc.passed,
      stdout: tc.stdout,
      expected: tc.expected,
      stderr: tc.stderr,
      status: tc.status,
      memory: tc.memoryRaw,
      time: tc.timeRaw,
    })),
  );

  if (allPassed) {
    await db
      .insert(solvedProblemTable)
      .values({
        userId,
        problemId,
        submissionId: submission.id,
        solutionCode: source_code,
        language: getLanguage(Number(language_id)),
        runtime,
        memory,
      })
      .onConflictDoNothing();
  }
  new ApiResponse(201, "Code submitted successfully", {
    ...submission,
    testCases,
  }).send(res);
});

export const runCode = asyncHandler(async (req: Request, res: Response) => {
  if (!isAuthenticated(req))
    throw new ApiError(401, "Authentication required", "UNAUTHORIZED");

  const {source_code, language_id, stdin, expected_outputs, problemId} =
    req.body as SubmitCode;

  const lang = getLanguage(Number(language_id)).toLowerCase();
  const problemRecord = await db
    .select({driverCode: problemTable.driverCode})
    .from(problemTable)
    .where(eq(problemTable.id, problemId))
    .then((r) => r[0]);

  if (!problemRecord) throw new ApiError(404, "Problem not found", "NOT_FOUND");

  const finalCode = buildFinalCode(source_code, problemRecord.driverCode, lang);

  const judge0Response = await submitBatch(
    stdin.map((input) => ({
      source_code: finalCode,
      language_id: Number(language_id),
      stdin: input,
    })),
  );

  const results = await pullBatchResults(judge0Response.map((s) => s.token));
  const {testCases, allPassed, status} = mapJudgeResults(
    results,
    expected_outputs,
  );

  new ApiResponse(200, "Code executed successfully", {
    status,
    allPassed,
    language: getLanguage(Number(language_id)),
    testCases,
  }).send(res);
});
