import axios from "axios";
import "dotenv/config";

const headers = {
  Authorization: `Bearer ${process.env.JUDGE0_API_KEY}`,
};
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function getJudge0LanguageCode(language: string): number {
  const languageMap: {[key: string]: number} = {
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
  expected_output?: string;
}

interface SubmissionResult {
  token: string;
}
export async function submitBatch(
  submissions: Submission[],
): Promise<SubmissionResult[]> {
  const {data} = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    {headers, submissions},
  );
  console.log("Submission result:", data);
  return data;
}

export async function pullBatchResults(tokens: string[]): Promise<any[]> {
  // it called pooling
  while (true) {
    const {data} = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
        headers,
      },
    );
    // console.log("Pulling results for tokens:", tokens);
    console.log("Data:", data);

    const result = data.submissions;
    if (!result) throw new Error("No result found  for the given tokens.");
    const isAllCompleted = result.every(
      (submission: any) =>
        submission.status.id !== 1 && submission.status.id !== 2,
    );
    if (isAllCompleted) return result;
    await sleep(1000); // Wait for 2 seconds before checking again
  }
}

export function getLanguage(languageId: number): string {
  const languageMap: {[key: number]: string} = {
    71: "Python",
    62: "Java",
    63: "JavaScript",
    74: "TypeScript",
  };
  return languageMap[languageId] || "Unknown";
}
