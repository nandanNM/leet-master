import {pgEnum, pgTable as table} from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import {usersTable} from "./user";
import {relations} from "drizzle-orm";
import {problemsTable} from "./problem";
import {testCaseResultsTable} from "./test-case";
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
  id: t.uuid("id").primaryKey().defaultRandom(),
  userId: t
    .uuid("user_id")
    .references(() => usersTable.id, {onDelete: "cascade"})
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
  createdAt: t.timestamp("created_at").defaultNow(),
  updatedAt: t
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const submissionsRelations = relations(
  submissionsTable,
  ({one, many}) => ({
    user: one(usersTable, {
      fields: [submissionsTable.userId],
      references: [usersTable.id],
    }),
    problem: one(problemsTable, {
      fields: [submissionsTable.problemId],
      references: [problemsTable.id],
    }),
    testCases: many(testCaseResultsTable),
  }),
);
