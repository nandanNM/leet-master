import {Request, Response} from "express";
import {SubmitCode} from "../schemas/submit-code";
import {getLanguage, pullBatchResults, submitBatch} from "../utils/lib/judge0";
import {db} from "../db";
import {
  solvedProblemsTable,
  submissionsTable,
  testCaseResultsTable,
} from "../db/schema";
import {ApiResponse, ApiError, errorResponse} from "../utils/responses";
import {isAuthenticated} from "../utils/auth";
import {asyncHandler} from "../utils/async-handler";

export const executeCode = asyncHandler(async (req: Request, res: Response) => {
  if (!isAuthenticated(req)) {
    throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
  }

  const {source_code, language_id, stdin, expected_outputs, problemId} =
    req.body as SubmitCode;
  const {id: userId} = req.user;

  // prepare all test cases for judge0 submission
  const submissions = stdin.map((input) => ({
    source_code,
    language_id: Number(language_id),
    stdin: input,
  }));

  // send batch test cases to judge0
  const judge0Response = await submitBatch(submissions);
  const tokens = judge0Response.map((submission) => submission.token);

  // wait for all test cases to be completed
  const results = await pullBatchResults(tokens);

  // analyze the results for test cases
  let allTestCasesPassed = true;
  const detailedResults = results.map((result, index) => {
    const {
      stdout: actualOutput,
      time,
      memory,
      stderr,
      compile_output,
      status,
    } = result;
    const stdout = actualOutput?.trim();
    const expectedOutput = expected_outputs[index]?.trim();
    const isTestCasePassed =
      (stdout.replace(/\r\n/g, "\n") || "") ===
      (expectedOutput.replace(/\r\n/g, "\n") || "");

    if (!isTestCasePassed) allTestCasesPassed = false;

    return {
      testCase: index + 1,
      passed: isTestCasePassed,
      stdout,
      expected: expectedOutput,
      stderr,
      compileOutput: compile_output,
      status: status.description || "Unknown",
      memory: memory ? `${memory} KB` : undefined,
      time: time ? `${time} s` : undefined,
    };
  });

  // entry for submission table in db
  const [submission] = await db
    .insert(submissionsTable)
    .values({
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguage(Number(language_id)),
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(detailedResults.map((result) => result.stdout)),
      stderr: detailedResults.some((result) => result.stderr)
        ? JSON.stringify(detailedResults.map((result) => result.stderr))
        : null,
      compileOutput: detailedResults.some((result) => result.compileOutput)
        ? JSON.stringify(detailedResults.map((result) => result.compileOutput))
        : null,
      status: allTestCasesPassed ? "ACCEPTED" : "WRONG_ANSWER",
      memory: detailedResults.some((result) => result.memory)
        ? JSON.stringify(detailedResults.map((result) => result.memory))
        : null,
      time: detailedResults.some((result) => result.time)
        ? JSON.stringify(detailedResults.map((result) => result.time))
        : null,
    })
    .returning();

  // if all passed mark the problem as solved
  if (allTestCasesPassed) {
    await db
      .insert(solvedProblemsTable)
      .values({
        userId,
        problemId,
      })
      .onConflictDoNothing()
      .returning({id: solvedProblemsTable.id});
  }

  // save individual test case results
  const testCaseResults = detailedResults.map((result) => ({
    submissionId: submission.id,
    ...result,
  }));
  await db.insert(testCaseResultsTable).values(testCaseResults).returning();

  const submissionWithTestCases = {
    ...submission,
    testCases: testCaseResults,
  };

  new ApiResponse(
    201,
    "Code executed successfully",
    submissionWithTestCases,
  ).send(res);
});

export const runCode = asyncHandler(async (req: Request, res: Response) => {
  if (!isAuthenticated(req)) {
    throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
  }

  const {source_code, language_id, stdin, expected_outputs, problemId} =
    req.body as SubmitCode;
  const {id: userId} = req.user;

  const submissions = stdin.map((input) => ({
    source_code,
    language_id: Number(language_id),
    stdin: input,
  }));

  const judge0Response = await submitBatch(submissions);
  const tokens = judge0Response.map((submission) => submission.token);

  const results = await pullBatchResults(tokens);

  let allTestCasesPassed = true;
  const testCases = results.map((result, index) => {
    const expected = expected_outputs[index]?.trim() ?? "";
    const actual = result.stdout?.trim() ?? "";
    const passed =
      actual.replace(/\r\n/g, "\n") === expected.replace(/\r\n/g, "\n");

    if (!passed) allTestCasesPassed = false;

    return {
      testCase: index + 1,
      passed,
      stdout: actual,
      expected,
      stderr: result.stderr ?? null,
      compileOutput: result.compile_output ?? null,
      status: result.status?.description ?? "Unknown",
      memory: result.memory ? `${result.memory} KB` : null,
      time: result.time ? `${result.time} s` : null,
    };
  });

  const now = new Date().toISOString();

  const fakeSubmission = {
    id: crypto.randomUUID(),
    userId,
    problemId,
    sourceCode: source_code,
    language: getLanguage(Number(language_id)),
    stdin: stdin.join("\n"),
    stdout: JSON.stringify(testCases.map((tc) => tc.stdout)),
    stderr: testCases.some((tc) => tc.stderr)
      ? JSON.stringify(testCases.map((tc) => tc.stderr))
      : null,
    compileOutput: testCases.some((tc) => tc.compileOutput)
      ? JSON.stringify(testCases.map((tc) => tc.compileOutput))
      : null,
    status: allTestCasesPassed ? "ACCEPTED" : "WRONG_ANSWER",
    memory: testCases.some((tc) => tc.memory)
      ? JSON.stringify(testCases.map((tc) => tc.memory))
      : null,
    time: testCases.some((tc) => tc.time)
      ? JSON.stringify(testCases.map((tc) => tc.time))
      : null,
    createdAt: now,
    updatedAt: now,
    testCases,
  };

  new ApiResponse(200, "Code executed successfully", fakeSubmission).send(res);
});
