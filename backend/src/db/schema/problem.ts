import { pgEnum, pgTable as table, uniqueIndex } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";
import { submissionsTable } from "./submission";
export const difficultyEnum = pgEnum("difficulty", ["EASY", "MEDIUM", "HARD"]);

export const problemsTable = table("problems", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  title: t.varchar({ length: 255 }).notNull(),
  description: t.text("description").notNull(),
  difficulty: difficultyEnum().notNull(),
  tags: t.text("tags").array().notNull(), // text[]
  userId: t
    .uuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  examples: t.jsonb("examples").notNull(),
  constraints: t.text("constraints").notNull(),
  hints: t.text("hints"),
  editorial: t.text("editorial"),
  testcases: t.jsonb("testcases").notNull(),
  codeSnippets: t.jsonb("code_snippets").notNull(),
  referenceSolutions: t.jsonb("reference_solutions").notNull(),
  createdAt: t.timestamp("created_at").defaultNow(),
  updatedAt: t
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const solvedProblemsTable = table(
  "solved_problems",
  {
    id: t.uuid("id").primaryKey().defaultRandom(),
    userId: t
      .uuid("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    problemId: t
      .uuid("problem_id")
      .references(() => problemsTable.id, { onDelete: "cascade" })
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
      t.problemId
    ),
  })
);

export const problemsRelations = relations(problemsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [problemsTable.userId],
    references: [usersTable.id],
  }),
  submissions: many(submissionsTable),
  solvedBy: many(solvedProblemsTable),
}));

export const solvedProblemsRelations = relations(
  solvedProblemsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [solvedProblemsTable.userId],
      references: [usersTable.id],
    }),
    problem: one(problemsTable, {
      fields: [solvedProblemsTable.problemId],
      references: [problemsTable.id],
    }),
  })
);
