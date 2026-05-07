import "@dotenvx/dotenvx/config";
import axios, {AxiosError} from "axios";
import {Pool} from "pg";

const BASE = "http://localhost:3000/api/v1";
const pool = new Pool({connectionString: process.env.DATABASE_URL});

const EMAIL = "testadmin@leetmaster.dev";
const PASSWORD = "Test1234!";
const NAME = "Test Admin";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(retries = 20): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await axios.get(`${BASE}/health`);
      console.log("✓ Server is up");
      return;
    } catch {
      console.log(`  Waiting for server... (${i + 1}/${retries})`);
      await sleep(1500);
    }
  }
  throw new Error("Server did not start in time");
}

async function main() {
  await waitForServer();

  // ── 1. Sign up ─────────────────────────────────────────────────────────────
  let userId: string;
  try {
    const res = await axios.post(`${BASE}/auth/sign-up/email`, {
      email: EMAIL,
      password: PASSWORD,
      name: NAME,
    });
    userId = res.data.user.id;
    console.log(`✓ Signed up  (id: ${userId})`);
  } catch (e: any) {
    if (e?.response?.status === 422 || e?.response?.status === 409) {
      // user already exists — fetch id from DB
      const {rows} = await pool.query(`SELECT id FROM "user" WHERE email = $1`, [EMAIL]);
      userId = rows[0].id;
      console.log(`✓ User already exists  (id: ${userId})`);
    } else {
      throw e;
    }
  }

  // ── 2. Promote to admin in DB ───────────────────────────────────────────────
  await pool.query(`UPDATE "user" SET "role" = 'admin' WHERE "id" = $1`, [userId]);
  console.log("✓ Promoted user to admin");

  // ── 3. Sign in ─────────────────────────────────────────────────────────────
  const loginRes = await axios.post(`${BASE}/auth/sign-in/email`, {
    email: EMAIL,
    password: PASSWORD,
  });
  const rawCookies: string[] = (loginRes.headers["set-cookie"] as string[]) ?? [];
  const cookieHeader = rawCookies.map((c) => c.split(";")[0]).join("; ");
  console.log("✓ Signed in, session cookie acquired");

  const headers = {Cookie: cookieHeader};

  // ── 4. Create "Two Sum" problem ────────────────────────────────────────────
  const jsDriver = [
    "{{USER_CODE}}",
    "",
    "process.stdin.resume();",
    "process.stdin.setEncoding('utf8');",
    "let _in = '';",
    "process.stdin.on('data', d => _in += d);",
    "process.stdin.on('end', () => {",
    "  const lines = _in.trim().split('\\n');",
    "  const nums = JSON.parse(lines[0]);",
    "  const target = parseInt(lines[1]);",
    "  console.log(JSON.stringify(twoSum(nums, target)));",
    "});",
  ].join("\n");

  const jsSolution = [
    "function twoSum(nums, target) {",
    "  const map = {};",
    "  for (let i = 0; i < nums.length; i++) {",
    "    const comp = target - nums[i];",
    "    if (map[comp] !== undefined) return [map[comp], i];",
    "    map[nums[i]] = i;",
    "  }",
    "}",
  ].join("\n");

  let problemId: string;

  // Check if problem already exists before trying to create
  const existingProblem = await pool.query(`SELECT id FROM "problem" WHERE slug = 'two-sum'`);

  if (existingProblem.rows.length > 0) {
    problemId = existingProblem.rows[0].id;
    console.log(`✓ Problem already in DB  (id: ${problemId})`);
  } else {
  try {
    const createRes = await axios.post(
      `${BASE}/problem/create`,
      {
        title: "Two Sum",
        slug: "two-sum",
        description:
          "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        difficulty: "EASY",
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
          },
          {input: "nums = [3,2,4], target = 6", output: "[1,2]"},
          {input: "nums = [3,3], target = 6", output: "[0,1]"},
        ],
        constraints:
          "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\nOnly one valid answer exists.",
        driverCode: {javascript: jsDriver},
        referenceSolutions: {javascript: jsSolution},
        testCases: [
          {input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isSample: true, order: 1},
          {input: "[3,2,4]\n6", expectedOutput: "[1,2]", isSample: true, order: 2},
          {input: "[3,3]\n6", expectedOutput: "[0,1]", isSample: false, order: 3},
        ],
        timeLimit: 2000,
        memoryLimit: 256,
      },
      {headers},
    );
    problemId = createRes.data.data.problemId;
    console.log(`✓ Problem created  (id: ${problemId})`);
  } catch (e: any) {
    console.error("Problem creation error:", e?.response?.data ?? e.message);
    throw e;
  }
  }

  // ── 5. Submit correct solution ──────────────────────────────────────────────
  console.log("\nSubmitting correct solution...");
  const submitRes = await axios.post(
    `${BASE}/execute-code/submit-code`,
    {
      source_code: jsSolution,
      language_id: 63,
      problemId,
      stdin: ["[2,7,11,15]\n9", "[3,2,4]\n6", "[3,3]\n6"],
      expected_outputs: ["[0,1]", "[1,2]", "[0,1]"],
    },
    {headers},
  );

  const {data} = submitRes.data;
  console.log(`\n${"─".repeat(50)}`);
  console.log(`Status  : ${data.status}`);
  console.log(`Language: ${data.language}`);
  console.log(`\nTest cases:`);
  for (const tc of data.testCases) {
    const icon = tc.passed ? "✓" : "✗";
    console.log(`  ${icon} TC${tc.testCase}: got="${tc.stdout}" expected="${tc.expected}" [${tc.status}] time=${tc.time} mem=${tc.memory}`);
  }
  console.log(`${"─".repeat(50)}\n`);

  // ── 6. Submit wrong solution ────────────────────────────────────────────────
  console.log("Submitting wrong solution...");
  const wrongRes = await axios.post(
    `${BASE}/execute-code/submit-code`,
    {
      source_code: "function twoSum(nums, target) { return [0, 0]; }",
      language_id: 63,
      problemId,
      stdin: ["[2,7,11,15]\n9", "[3,2,4]\n6", "[3,3]\n6"],
      expected_outputs: ["[0,1]", "[1,2]", "[0,1]"],
    },
    {headers},
  );

  const {data: wrongData} = wrongRes.data;
  console.log(`Status: ${wrongData.status}`);
  for (const tc of wrongData.testCases) {
    const icon = tc.passed ? "✓" : "✗";
    console.log(`  ${icon} TC${tc.testCase}: got="${tc.stdout}" expected="${tc.expected}"`);
  }

  console.log("\n✓ All tests done!");
  await pool.end();
}

main().catch(async (err: AxiosError | Error) => {
  const axiosErr = err as AxiosError;
  console.error("\n✗ Test failed:", axiosErr.response?.data ?? err.message);
  await pool.end();
  process.exit(1);
});
