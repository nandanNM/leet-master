import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  foreignKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import {baseSchema, user} from "./auth-schema";

//  ENUMS

export const difficultyEnum = pgEnum("difficulty", ["EASY", "MEDIUM", "HARD"]);

export const submissionStatusEnum = pgEnum("submissionStatus", [
  "ACCEPTED",
  "WRONG_ANSWER",
  "TIME_LIMIT_EXCEEDED",
  "MEMORY_LIMIT_EXCEEDED",
  "RUNTIME_ERROR",
  "COMPILE_ERROR",
  "INTERNAL_ERROR",
]);
export const challengeStatusEnum = pgEnum("challengeStatus", [
  "PENDING", // Waiting for participants to accept
  "ACTIVE", // Challenge is currently ongoing
  "COMPLETED",
  "CANCELLED",
]);

export const participantStatusEnum = pgEnum("participantStatus", [
  "INVITED",
  "ACCEPTED",
  "DECLINED",
  "LEFT",
]);
export const invitationStatusEnum = pgEnum("invitationStatus", [
  "PENDING",
  "ACCEPTED",
  "EXPIRED",
]);

//PROBLEMS
export const problem = pgTable(
  "problem",
  {
    ...baseSchema,
    title: varchar("title", {length: 255}).notNull(),
    slug: varchar("slug", {length: 255}).notNull().unique(),
    description: text("description").notNull(),
    difficulty: difficultyEnum("difficulty").notNull(),
    videoUrl: varchar("videoUrl", {length: 1000}),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, {onDelete: "cascade"}),

    examples: jsonb("examples").notNull(),
    constraints: text("constraints"),
    hints: text("hints"),
    editorialCode: jsonb("editorialCode").$type<Record<string, string>>(),

    codeSnippets: jsonb("codeSnippets"),
    referenceSolutions: jsonb("referenceSolutions"),
    driverCode: jsonb("driverCode").$type<Record<string, string>>(),

    // Standardized to ms and KB for easier sorting/filtering
    timeLimit: integer("timeLimit").default(2000),
    memoryLimit: integer("memoryLimit").default(256),
  },
  (t) => ({
    difficultyIdx: index("problemDifficultyIdx").on(t.difficulty),
  }),
);

//TEST CASES & RESULTS

export const testCase = pgTable(
  "testCase",
  {
    ...baseSchema,
    problemId: uuid("problemId")
      .notNull()
      .references(() => problem.id, {onDelete: "cascade"}),
    input: text("input").notNull(),
    expectedOutput: text("expectedOutput").notNull(),
    isSample: boolean("isSample").default(false),
    order: integer("order"),
  },
  (t) => ({
    problemIdx: index("testCaseProblemIdx").on(t.problemId),
  }),
);

export const submission = pgTable(
  "submission",
  {
    ...baseSchema,
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, {onDelete: "cascade"}),
    problemId: uuid("problemId")
      .notNull()
      .references(() => problem.id, {onDelete: "cascade"}),

    sourceCode: text("sourceCode").notNull(),
    language: varchar("language", {length: 50}).notNull(),
    status: submissionStatusEnum("status"),

    runtime: integer("runtime"), // in ms
    memory: integer("memory"), // in KB

    stdout: text("stdout"),
    stderr: text("stderr"),
    compileOutput: text("compileOutput"),
  },
  (t) => ({
    userProblemIdx: index("submissionUserProblemIdx").on(t.userId, t.problemId),
    statusIdx: index("submissionStatusIdx").on(t.status),
  }),
);

export const testCaseResult = pgTable(
  "testCaseResult",
  {
    ...baseSchema,
    submissionId: uuid("submissionId")
      .notNull()
      .references(() => submission.id, {onDelete: "cascade"}),
    testCaseId: uuid("testCaseId").references(() => testCase.id),

    passed: boolean("passed").notNull(),
    stdout: text("stdout"),
    expected: text("expected"),
    stderr: text("stderr"),

    status: varchar("status", {length: 50}),
    memory: integer("memory"),
    time: integer("time"),
  },
  (t) => ({
    submissionIdx: index("testCaseSubmissionIdx").on(t.submissionId),
  }),
);

// DISCUSSIONS

export const discussion = pgTable(
  "discussion",
  {
    ...baseSchema,
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, {onDelete: "cascade"}),
    problemId: uuid("problemId")
      .notNull()
      .references(() => problem.id, {onDelete: "cascade"}),

    parentId: uuid("parentId"), // For threaded replies
    message: text("message").notNull(),
  },
  (t) => ({
    parentIdx: index("discussionParentIdx").on(t.parentId),
    problemIdx: index("discussionProblemIdx").on(t.problemId),
    parentFk: foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
    }).onDelete("cascade"),
  }),
);
// CATEGORIES
export const subject = pgTable("subject", {
  ...baseSchema,
  name: varchar("name", {length: 255}).notNull(),
  slug: varchar("slug", {length: 255}).notNull().unique(),
});

export const problemSubject = pgTable(
  "problemSubject",
  {
    problemId: uuid("problemId")
      .notNull()
      .references(() => problem.id, {onDelete: "cascade"}),
    subjectId: uuid("subjectId")
      .notNull()
      .references(() => subject.id, {onDelete: "cascade"}),
  },
  (t) => ({
    pkIdx: index("problemSubjectIdx").on(t.problemId, t.subjectId),
  }),
);

export const solvedProblem = pgTable(
  "solvedProblem",
  {
    ...baseSchema,
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, {onDelete: "cascade"}),
    problemId: uuid("problemId")
      .notNull()
      .references(() => problem.id, {onDelete: "cascade"}),
    submissionId: uuid("submissionId")
      .notNull()
      .references(() => submission.id),
    solutionCode: text("solutionCode").notNull(),
    language: varchar("language", {length: 50}).notNull(),
    runtime: integer("runtime"),
    memory: integer("memory"),
    solvedAt: timestamp("solvedAt").defaultNow().notNull(),
  },
  (t) => ({
    // Ensures a user only has one "Solved" entry per problem
    userProblemUnique: uniqueIndex("userProblemUniqueIdx").on(
      t.userId,
      t.problemId,
    ),
    userSolvedIdx: index("userSolvedIdx").on(t.userId),
  }),
);

export const company = pgTable("company", {
  ...baseSchema,
  name: varchar("name", {length: 255}).notNull(),
});

export const problemCompany = pgTable(
  "problemCompany",
  {
    problemId: uuid("problemId")
      .notNull()
      .references(() => problem.id, {onDelete: "cascade"}),
    companyId: uuid("companyId")
      .notNull()
      .references(() => company.id, {onDelete: "cascade"}),
  },
  (t) => ({
    cpPk: uniqueIndex("problemCompanyUniqueIdx").on(t.problemId, t.companyId),
  }),
);

export const challenge = pgTable(
  "challenge",
  {
    ...baseSchema,
    creatorId: uuid("creatorId")
      .notNull()
      .references(() => user.id, {onDelete: "cascade"}),
    problemId: uuid("problemId")
      .notNull()
      .references(() => problem.id, {onDelete: "cascade"}),

    title: varchar("title", {length: 255}),
    status: challengeStatusEnum("status").default("PENDING").notNull(),

    // WINNER TRACKING
    winnerId: uuid("winnerId").references(() => user.id, {
      onDelete: "set null",
    }),
    winningSubmissionId: uuid("winningSubmissionId").references(
      () => submission.id,
      {onDelete: "set null"},
    ),

    expiresAt: timestamp("expiresAt").notNull(),
    startsAt: timestamp("startsAt"),
    endsAt: timestamp("endsAt"),
  },
  (t) => ({
    creatorIdx: index("challengeCreatorIdx").on(t.creatorId),
    winnerIdx: index("challengeWinnerIdx").on(t.winnerId),
  }),
);

export const challengeParticipant = pgTable(
  "challengeParticipant",
  {
    ...baseSchema,
    challengeId: uuid("challengeId")
      .notNull()
      .references(() => challenge.id, {onDelete: "cascade"}),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, {onDelete: "cascade"}),

    status: participantStatusEnum("status").default("INVITED").notNull(),

    // The specific submission used for this challenge
    submissionId: uuid("submissionId").references(() => submission.id, {
      onDelete: "set null",
    }),

    // The exact moment they clicked "Submit" and passed
    completedAt: timestamp("completedAt"),
  },
  (t) => ({
    cpPk: uniqueIndex("challengeParticipantIdx").on(t.challengeId, t.userId),
  }),
);
export const challengeInvitation = pgTable(
  "challengeInvitation",
  {
    ...baseSchema,
    challengeId: uuid("challengeId")
      .notNull()
      .references(() => challenge.id, {onDelete: "cascade"}),
    email: varchar("email", {length: 255}).notNull(),
    token: varchar("token", {length: 255}).notNull().unique(), // For the unique signup link
    status: invitationStatusEnum("status").default("PENDING").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
  },
  (t) => ({
    emailIdx: index("invitationEmailIdx").on(t.email),
    challengeIdx: index("invitationChallengeIdx").on(t.challengeId),
  }),
);
