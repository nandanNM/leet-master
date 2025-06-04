import {pgEnum, pgTable as table} from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {usersTable} from "./user";
import {problemsTable} from "./problem";

export const discussionTable = table("discussions", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  userId: t
    .uuid("user_id")
    .references(() => usersTable.id, {onDelete: "cascade"})
    .notNull(),
  problemId: t
    .uuid("problem_id")
    .references(() => problemsTable.id, {onDelete: "cascade"})
    .notNull(),
  message: t.text("message"),
  createdAt: t.timestamp("created_at").defaultNow(),
  updatedAt: t
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const discussionsRelations = relations(
  discussionTable,
  ({one, many}) => ({
    user: one(usersTable, {
      fields: [discussionTable.userId],
      references: [usersTable.id],
    }),
    problem: one(problemsTable, {
      fields: [discussionTable.problemId],
      references: [problemsTable.id],
    }),
  }),
);
