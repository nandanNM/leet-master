import { pgEnum, pgTable as table, uniqueIndex } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";
import { testCaseResultsTable } from "./test-case";
export const difficultyEnum = pgEnum("difficulty", ["EASY", "MEDIUM", "HARD"]);

export const probleamsTable = table("probleams", {
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
    probleamId: t
      .uuid("probleam_id")
      .references(() => probleamsTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: t.timestamp("created_at").defaultNow(),
    updatedAt: t
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    uniqueUserProbleam: uniqueIndex("unique_user_probleam").on(
      t.userId,
      t.probleamId
    ),
  })
);

export const probleamsRelations = relations(
  probleamsTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [probleamsTable.userId],
      references: [usersTable.id],
    }),
    submissions: many(testCaseResultsTable),
    solvedBy: many(solvedProblemsTable),
  })
);

export const solvedProblemsRelations = relations(
  solvedProblemsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [solvedProblemsTable.userId],
      references: [usersTable.id],
    }),
    probleam: one(probleamsTable, {
      fields: [solvedProblemsTable.probleamId],
      references: [probleamsTable.id],
    }),
  })
);
