import axios from "axios";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function getJudge0LanguageCode(language: string): number {
  const languageMap: { [key: string]: number } = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[language.toUpperCase()];
}

interface Submission {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
}
[];
interface SubmissionResult {
  token: string;
}
export async function submitBatch(
  submissions: Submission
): Promise<SubmissionResult[]> {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    { submissions }
  );
  console.log("Submission result:", data);
  return data;
}

export async function pullBatchResults(tokens: string[]): Promise<any[]> {
  // it called pooling
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      }
    );
    // console.log("Pulling results for tokens:", tokens);
    console.log("Data:", data);

    const result = data.submissions;
    console.log("Result:", result);
    const isAllCompleted = result.every(
      (submission: any) =>
        submission.status.id !== 1 && submission.status.id !== 2
    );
    if (isAllCompleted) return result;
    await sleep(1000); // Wait for 2 seconds before checking again
  }
}
