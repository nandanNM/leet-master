import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";
export const difficultyEnum = pgEnum("difficulty", ["EASY", "MEDIUM", "HARD"]);

export const problemsTable = table("probleams", {
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

export const probleamsRelations = relations(problemsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [problemsTable.userId],
    references: [usersTable.id],
  }),
}));
