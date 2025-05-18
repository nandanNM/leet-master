import { Request, Response } from "express";
import { ApiResponse, errorResponse } from "../utils/responses";
import { SubmitCode } from "../schemas/submit-code";
import {
  getLanguage,
  pullBatchResults,
  submitBatch,
} from "../utils/lib/judge0";
import { db } from "../db";
import {
  solvedProblemsTable,
  submissionsTable,
  testCaseResultsTable,
} from "../db/schema";
import { json } from "stream/consumers";
export async function executeCode(req: Request, res: Response): Promise<any> {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body as SubmitCode;
  const { id: userId } = req.user;
  try {
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
    // pullBatchResults will keep polling until all test cases are completed
    const results = await pullBatchResults(tokens);
    console.log("Results for tokens on judge0 code execution:", results);
    // analyze the results for tast cases
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
      console.log("stdout:", stdout);
      const expectedOutput = expected_outputs[index]?.trim();
      console.log("expectedOutput:", expectedOutput);
      const isTestCasePassed =
        (stdout.replace(/\r\n/g, "\n") || "") ===
        (expectedOutput.replace(/\r\n/g, "\n") || "");
      console.log(
        `Test Case ${
          index + 1
        }: Expected Output: ${expectedOutput}, Actual Output: ${stdout}, Pass: ${isTestCasePassed}`
      );
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
          ? JSON.stringify(
              detailedResults.map((result) => result.compileOutput)
            )
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
    console.log("Submission entry in db:", submission);
    // if all passed mark the problem as solved
    if (allTestCasesPassed) {
      await db
        .insert(solvedProblemsTable)
        .values({
          userId,
          problemId,
        })
        .onConflictDoNothing()
        .returning({ id: solvedProblemsTable.id });
    }
    // save individual test case results using detailedResults
    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      ...result,
    }));
    await db.insert(testCaseResultsTable).values(testCaseResults).returning();
    const submissionWithTestCases = {
      ...submission,
      testCases: testCaseResults,
    };
    return new ApiResponse(
      201,
      "Code executed successfully",
      true,
      submissionWithTestCases
    ).send(res);
  } catch (error) {
    console.error("Error executing code:", error);
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
