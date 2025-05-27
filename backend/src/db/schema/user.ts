import {relations} from "drizzle-orm";
import {pgEnum, pgTable as table} from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import {submissionsTable} from "./submission";
import {problemsTable, solvedProblemsTable} from "./problem";
export const rolesEnum = pgEnum("role", ["ADMIN", "USER"]);

export const usersTable = table("users", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  name: t.varchar({length: 255}).notNull(),
  email: t.varchar({length: 255}).notNull().unique(),
  password: t.varchar({length: 255}),
  avatar: t.text("avatar"),
  role: rolesEnum().default("USER").notNull(),

  createdAt: t.timestamp("created_at").defaultNow(),
  updatedAt: t
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(usersTable, ({many}) => ({
  submissions: many(submissionsTable),
  problems: many(problemsTable),
  solvedProblems: many(solvedProblemsTable),
}));
