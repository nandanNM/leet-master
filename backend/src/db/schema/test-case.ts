import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { submissionsTable } from "./submission";

export const testCaseResultsTable = table(
  "test_case_results",
  {
    id: t.uuid("id").primaryKey().defaultRandom(),
    submissionId: t
      .uuid("submission_id")
      .references(() => submissionsTable.id, { onDelete: "cascade" })
      .notNull(),
    testCase: t.integer("test_case").notNull(), // you can add foreign key if there's a testCases table
    passed: t.boolean("passed").notNull(),
    stdout: t.text("stdout"),
    expected: t.text("expected"),
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
  },
  (table) => ({
    submissionIdIdx: t
      .index("test_case_results_submission_id_idx")
      .on(table.submissionId),
  })
);

export const testCaseResultsRelations = relations(
  testCaseResultsTable,
  ({ one }) => ({
    testCase: one(submissionsTable, {
      fields: [testCaseResultsTable.submissionId],
      references: [submissionsTable.id],
    }),
  })
);
