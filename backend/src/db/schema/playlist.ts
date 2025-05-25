import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";
import { problemsTable } from "./problem";

export const playlistsTable = table(
  "playlists",
  {
    id: t.uuid("id").primaryKey().defaultRandom(),
    name: t.varchar({ length: 255 }).notNull(),
    description: t.text("description"),
    userId: t
      .uuid("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: t.timestamp("created_at").defaultNow(),
    updatedAt: t
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdNameUnique: t.unique().on(table.userId, table.name),
  })
);

export const problemsInPlaylistTable = table(
  "problems_in_playlist",
  {
    id: t.uuid("id").primaryKey().defaultRandom(),
    playListId: t
      .uuid("playlist_id")
      .notNull()
      .references(() => playlistsTable.id, { onDelete: "cascade" }),

    problemId: t
      .uuid("problem_id")
      .notNull()
      .references(() => problemsTable.id, { onDelete: "cascade" }),

    createdAt: t.timestamp("created_at").defaultNow(),
    updatedAt: t
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueProblemInPlaylist: t.unique().on(table.playListId, table.problemId),
  })
);

export const playlistsRelations = relations(
  playlistsTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [playlistsTable.userId],
      references: [usersTable.id],
    }),
    problems: many(problemsInPlaylistTable),
  })
);

export const problemsInPlaylistRelations = relations(
  problemsInPlaylistTable,
  ({ one }) => ({
    playlist: one(playlistsTable, {
      fields: [problemsInPlaylistTable.playListId],
      references: [playlistsTable.id],
    }),
    problem: one(problemsTable, {
      fields: [problemsInPlaylistTable.problemId],
      references: [problemsTable.id],
    }),
  })
);
