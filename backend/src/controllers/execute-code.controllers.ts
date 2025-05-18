import { Request, Response } from "express";
import { ApiResponse, errorResponse } from "../utils/responses";
import { SubmitCode } from "../schemas/submit-code";
import { pullBatchResults, submitBatch } from "../utils/lib/judge0";
export async function executeCode(req: Request, res: Response): Promise<any> {
  const { source_code, language_id, stdin, expected_outputs, probleamId } =
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
    return new ApiResponse(200, "code executed successfully", true);
  } catch (error) {
    console.error("Error executing code:", error);
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
