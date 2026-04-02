import {submissionStatusEnum} from "../db/schema";

type SubmissionStatus = (typeof submissionStatusEnum.enumValues)[number];

interface MappedTestCase {
  testCase: number;
  passed: boolean;
  stdout: string | null;
  expected: string;
  stderr: string | null;
  compileOutput: string | null;
  status: string;
  memory: string | null;
  time: string | null;
  memoryRaw: number | null;
  timeRaw: number | null;
}

interface MappedResults {
  testCases: MappedTestCase[];
  allPassed: boolean;
  status: SubmissionStatus;
  runtime: number | null;
  memory: number | null;
}

export function buildFinalCode(
  sourceCode: string,
  driverCode: Record<string, string> | null | undefined,
  lang: string,
): string {
  const driver = driverCode?.[lang];
  return driver ? driver.replace("{{USER_CODE}}", sourceCode) : sourceCode;
}

export function mapJudgeResults(
  results: any[],
  expectedOutputs: string[],
): MappedResults {
  let allPassed = true;
  let detectedStatus: SubmissionStatus = "ACCEPTED";
  const runtimes: number[] = [];
  const memories: number[] = [];

  const testCases: MappedTestCase[] = results.map((result, index) => {
    const stdout = result.stdout?.trim() ?? null;
    const expected = expectedOutputs[index]?.trim() ?? "";
    const passed =
      (stdout ?? "").replace(/\r\n/g, "\n") === expected.replace(/\r\n/g, "\n");

    if (!passed) {
      allPassed = false;
      detectedStatus = resolveSubmissionStatus(
        result.status?.id,
        detectedStatus,
      );
    }

    if (result.time) runtimes.push(parseFloat(result.time) * 1000);
    if (result.memory) memories.push(result.memory);

    return {
      testCase: index + 1,
      passed,
      stdout,
      expected,
      stderr: result.stderr ?? null,
      compileOutput: result.compile_output ?? null,
      status: result.status?.description ?? "Unknown",
      memory: result.memory ? `${result.memory} KB` : null,
      time: result.time ? `${result.time} s` : null,
      memoryRaw: result.memory ?? null,
      timeRaw: result.time ? Math.round(parseFloat(result.time) * 1000) : null,
    };
  });

  const runtime = runtimes.length ? Math.round(Math.max(...runtimes)) : null;
  const memory = memories.length ? Math.round(Math.max(...memories)) : null;

  return {
    testCases,
    allPassed,
    status: allPassed ? "ACCEPTED" : detectedStatus,
    runtime,
    memory,
  };
}

export function resolveSubmissionStatus(
  judge0StatusId: number,
  current: SubmissionStatus,
): SubmissionStatus {
  if (current === "COMPILE_ERROR" || current === "INTERNAL_ERROR")
    return current;

  const map: Record<number, SubmissionStatus> = {
    3: "ACCEPTED",
    4: "WRONG_ANSWER",
    5: "TIME_LIMIT_EXCEEDED",
    6: "COMPILE_ERROR",
    7: "RUNTIME_ERROR",
    8: "RUNTIME_ERROR",
    9: "RUNTIME_ERROR",
    10: "RUNTIME_ERROR",
    11: "RUNTIME_ERROR",
    12: "MEMORY_LIMIT_EXCEEDED",
    13: "INTERNAL_ERROR",
    14: "COMPILE_ERROR",
  };

  return map[judge0StatusId] ?? "RUNTIME_ERROR";
}
