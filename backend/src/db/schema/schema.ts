import {relations} from "drizzle-orm";
import {pgEnum, pgTable as table, uniqueIndex} from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import {baseSchema, userTable} from "./auth-schema";

// --- Problem Enums and Tables ---

export const difficultyEnum = pgEnum("difficulty", ["EASY", "MEDIUM", "HARD"]);

export const problemTable = table("problems", {
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

export const solvedProblemTable = table(
  "solved_problems",
  {
    id: t.uuid("id").primaryKey().defaultRandom(),
    userId: t
      .uuid("user_id")
      .references(() => userTable.id, {onDelete: "cascade"})
      .notNull(),
    problemId: t
      .uuid("problem_id")
      .references(() => problemTable.id, {onDelete: "cascade"})
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

export const submissionTable = table("submissions", {
  ...baseSchema,
  userId: t
    .uuid("user_id")
    .references(() => userTable.id, {onDelete: "cascade"})
    .notNull(),
  problemId: t
    .uuid("problem_id")
    .references(() => problemTable.id, {onDelete: "cascade"})
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

export const testCaseResultTable = table(
  "test_case_results",
  {
    ...baseSchema,
    submissionId: t
      .uuid("submission_id")
      .references(() => submissionTable.id, {onDelete: "cascade"})
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

export const playlistTable = table(
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

export const problemInPlaylistTable = table(
  "problems_in_playlist",
  {
    ...baseSchema,
    id: t.uuid("id").primaryKey().defaultRandom(),
    playListId: t
      .uuid("playlist_id")
      .notNull()
      .references(() => playlistTable.id, {onDelete: "cascade"}),

    problemId: t
      .uuid("problem_id")
      .notNull()
      .references(() => problemTable.id, {onDelete: "cascade"}),
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
    .references(() => problemTable.id, {onDelete: "cascade"})
    .notNull(),
  message: t.text("message"),
});

// --- Relations ---

export const problemRelations = relations(problemTable, ({one, many}) => ({
  user: one(userTable, {
    fields: [problemTable.userId],
    references: [userTable.id],
  }),
  submissions: many(submissionTable),
  solvedBy: many(solvedProblemTable),
  discussions: many(discussionTable),
}));

export const solvedProblemRelations = relations(
  solvedProblemTable,
  ({one}) => ({
    user: one(userTable, {
      fields: [solvedProblemTable.userId],
      references: [userTable.id],
    }),
    problem: one(problemTable, {
      fields: [solvedProblemTable.problemId],
      references: [problemTable.id],
    }),
  }),
);

export const submissionRelations = relations(
  submissionTable,
  ({one, many}) => ({
    user: one(userTable, {
      fields: [submissionTable.userId],
      references: [userTable.id],
    }),
    problem: one(problemTable, {
      fields: [submissionTable.problemId],
      references: [problemTable.id],
    }),
    testCases: many(testCaseResultTable),
  }),
);

export const testCaseResultRelations = relations(
  testCaseResultTable,
  ({one}) => ({
    testCase: one(submissionTable, {
      fields: [testCaseResultTable.submissionId],
      references: [submissionTable.id],
    }),
  }),
);

export const playlistRelations = relations(playlistTable, ({one, many}) => ({
  user: one(userTable, {
    fields: [playlistTable.userId],
    references: [userTable.id],
  }),
  problems: many(problemInPlaylistTable),
}));

export const problemInPlaylistRelations = relations(
  problemInPlaylistTable,
  ({one}) => ({
    playlist: one(playlistTable, {
      fields: [problemInPlaylistTable.playListId],
      references: [playlistTable.id],
    }),
    problem: one(problemTable, {
      fields: [problemInPlaylistTable.problemId],
      references: [problemTable.id],
    }),
  }),
);

export const discussionRelations = relations(
  discussionTable,
  ({one, many}) => ({
    user: one(userTable, {
      fields: [discussionTable.userId],
      references: [userTable.id],
    }),
    problem: one(problemTable, {
      fields: [discussionTable.problemId],
      references: [problemTable.id],
    }),
  }),
);
