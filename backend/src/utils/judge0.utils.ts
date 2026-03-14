import axios from "axios";
import "dotenv/config";

const headers = {
  "x-rapidapi-key": process.env.JUDGE0_API_KEY,
  "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
  "Content-Type": "application/json",
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
    {
      submissions,
    },
    {
      headers,
    },
  );
  return data;
}

export async function pullBatchResults(tokens: string[]): Promise<any[]> {
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

    const submissions = data.submissions;
    if (!submissions) throw new Error("No submissions returned from API.");

    // Status IDs: 1 = In Queue, 2 = Processing
    const isAllFinished = submissions.every(
      (sub: any) => sub.status && sub.status.id > 2,
    );

    if (isAllFinished) return submissions;

    // Back off slightly to avoid hitting RapidAPI rate limits
    await sleep(2000);
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
