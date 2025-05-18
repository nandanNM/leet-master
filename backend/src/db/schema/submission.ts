import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";
import { probleamsTable } from "./probleam";
import { testCaseResultsTable } from "./test-case";

export const submissionsTable = table("submissions", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  userId: t
    .uuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  problemId: t
    .uuid("problem_id")
    .references(() => probleamsTable.id, { onDelete: "cascade" })
    .notNull(),
  sourceCode: t.json("source_code").notNull(),
  language: t.varchar("language", { length: 100 }).notNull(),
  stdin: t.text("stdin"),
  stdout: t.text("stdout"),
  stderr: t.text("stderr"),
  compileOutput: t.text("compile_output"),
  status: t.varchar("status", { length: 50 }),
  memory: t.varchar("memory", { length: 50 }),
  time: t.varchar("time", { length: 50 }),
  createdAt: t.timestamp("created_at").defaultNow(),
  updatedAt: t
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const submissionsRelations = relations(
  submissionsTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [submissionsTable.userId],
      references: [usersTable.id],
    }),
    problem: one(probleamsTable, {
      fields: [submissionsTable.problemId],
      references: [probleamsTable.id],
    }),
    testCases: many(testCaseResultsTable),
  })
);
