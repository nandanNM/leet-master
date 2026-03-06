import {relations} from "drizzle-orm";
import {pgEnum, pgTable as table, uniqueIndex} from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import {baseSchema, userTable} from "./auth";

// --- Problem Enums and Tables ---

export const difficultyEnum = pgEnum("difficulty", ["EASY", "MEDIUM", "HARD"]);

export const problemsTable = table("problems", {
  ...baseSchema,
  title: t.varchar({length: 255}).notNull(),
  description: t.text("description").notNull(),
  difficulty: difficultyEnum().notNull(),
  tags: t.text("tags").array().notNull(),
  userId: t
    .uuid("user_id")
    .references(() => userTable.id, {onDelete: "cascade"})
    .notNull(),
  examples: t.jsonb("examples").notNull(),
  constraints: t.text("constraints").notNull(),
  hints: t.text("hints"),
  editorial: t.text("editorial"),
  testcases: t.jsonb("testcases").notNull(),
  codeSnippets: t.jsonb("code_snippets").notNull(),
  referenceSolutions: t.jsonb("reference_solutions").notNull(),
});

export const solvedProblemsTable = table(
  "solved_problems",
  {
    id: t.uuid("id").primaryKey().defaultRandom(),
    userId: t
      .uuid("user_id")
      .references(() => userTable.id, {onDelete: "cascade"})
      .notNull(),
    problemId: t
      .uuid("problem_id")
      .references(() => problemsTable.id, {onDelete: "cascade"})
      .notNull(),
    createdAt: t.timestamp("created_at").defaultNow(),
    updatedAt: t
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    uniqueUserProblem: uniqueIndex("unique_user_problem").on(
      t.userId,
      t.problemId,
    ),
  }),
);

// --- Submission Enums and Tables ---

export const submissionStatusEnum = pgEnum("submission_status", [
  "ACCEPTED",
  "WRONG_ANSWER",
  "TIME_LIMIT_EXCEEDED",
  "MEMORY_LIMIT_EXCEEDED",
  "RUNTIME_ERROR",
  "COMPILE_ERROR",
  "INTERNAL_ERROR",
]);

export const submissionsTable = table("submissions", {
  ...baseSchema,
  userId: t
    .uuid("user_id")
    .references(() => userTable.id, {onDelete: "cascade"})
    .notNull(),
  problemId: t
    .uuid("problem_id")
    .references(() => problemsTable.id, {onDelete: "cascade"})
    .notNull(),
  sourceCode: t.json("source_code").notNull(),
  language: t.varchar("language", {length: 100}).notNull(),
  stdin: t.text("stdin"),
  stdout: t.text("stdout"),
  stderr: t.text("stderr"),
  compileOutput: t.text("compile_output"),
  status: submissionStatusEnum("status"),
  memory: t.text("memory"),
  time: t.text("time"),
});

// --- Test Case Tables ---

export const testCaseResultsTable = table(
  "test_case_results",
  {
    ...baseSchema,
    submissionId: t
      .uuid("submission_id")
      .references(() => submissionsTable.id, {onDelete: "cascade"})
      .notNull(),
    testCase: t.integer("test_case").notNull(),
    passed: t.boolean("passed").notNull(),
    stdout: t.text("stdout"),
    expected: t.text("expected"),
    stderr: t.text("stderr"),
    compileOutput: t.text("compile_output"),
    status: t.varchar("status", {length: 50}),
    memory: t.varchar("memory", {length: 50}),
    time: t.varchar("time", {length: 50}),
  },
  (table) => ({
    submissionIdIdx: t
      .index("test_case_results_submission_id_idx")
      .on(table.submissionId),
  }),
);

// --- Playlist Tables ---

export const playlistsTable = table(
  "playlists",
  {
    ...baseSchema,
    name: t.varchar({length: 255}).notNull(),
    description: t.text("description"),
    userId: t
      .uuid("user_id")
      .references(() => userTable.id, {onDelete: "cascade"})
      .notNull(),
  },
  (table) => ({
    userIdNameUnique: t.unique().on(table.userId, table.name),
  }),
);

export const problemsInPlaylistTable = table(
  "problems_in_playlist",
  {
    ...baseSchema,
    id: t.uuid("id").primaryKey().defaultRandom(),
    playListId: t
      .uuid("playlist_id")
      .notNull()
      .references(() => playlistsTable.id, {onDelete: "cascade"}),

    problemId: t
      .uuid("problem_id")
      .notNull()
      .references(() => problemsTable.id, {onDelete: "cascade"}),
  },
  (table) => ({
    uniqueProblemInPlaylist: t.unique().on(table.playListId, table.problemId),
  }),
);

// --- Discussion Tables ---

export const discussionTable = table("discussions", {
  ...baseSchema,
  userId: t
    .uuid("user_id")
    .references(() => userTable.id, {onDelete: "cascade"})
    .notNull(),
  problemId: t
    .uuid("problem_id")
    .references(() => problemsTable.id, {onDelete: "cascade"})
    .notNull(),
  message: t.text("message"),
});

// --- Relations ---

export const problemsRelations = relations(problemsTable, ({one, many}) => ({
  user: one(userTable, {
    fields: [problemsTable.userId],
    references: [userTable.id],
  }),
  submissions: many(submissionsTable),
  solvedBy: many(solvedProblemsTable),
  discussions: many(discussionTable),
}));

export const solvedProblemsRelations = relations(
  solvedProblemsTable,
  ({one}) => ({
    user: one(userTable, {
      fields: [solvedProblemsTable.userId],
      references: [userTable.id],
    }),
    problem: one(problemsTable, {
      fields: [solvedProblemsTable.problemId],
      references: [problemsTable.id],
    }),
  }),
);

export const submissionsRelations = relations(
  submissionsTable,
  ({one, many}) => ({
    user: one(userTable, {
      fields: [submissionsTable.userId],
      references: [userTable.id],
    }),
    problem: one(problemsTable, {
      fields: [submissionsTable.problemId],
      references: [problemsTable.id],
    }),
    testCases: many(testCaseResultsTable),
  }),
);

export const testCaseResultsRelations = relations(
  testCaseResultsTable,
  ({one}) => ({
    testCase: one(submissionsTable, {
      fields: [testCaseResultsTable.submissionId],
      references: [submissionsTable.id],
    }),
  }),
);

export const playlistsRelations = relations(playlistsTable, ({one, many}) => ({
  user: one(userTable, {
    fields: [playlistsTable.userId],
    references: [userTable.id],
  }),
  problems: many(problemsInPlaylistTable),
}));

export const problemsInPlaylistRelations = relations(
  problemsInPlaylistTable,
  ({one}) => ({
    playlist: one(playlistsTable, {
      fields: [problemsInPlaylistTable.playListId],
      references: [playlistsTable.id],
    }),
    problem: one(problemsTable, {
      fields: [problemsInPlaylistTable.problemId],
      references: [problemsTable.id],
    }),
  }),
);

export const discussionsRelations = relations(
  discussionTable,
  ({one, many}) => ({
    user: one(userTable, {
      fields: [discussionTable.userId],
      references: [userTable.id],
    }),
    problem: one(problemsTable, {
      fields: [discussionTable.problemId],
      references: [problemsTable.id],
    }),
  }),
);
