import {
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {baseSchema, user} from "./auth-schema";
import {problem, submission} from "./schema";

export const challengeModeEnum = pgEnum("challengeMode", ["1v1", "group"]);

export const challengeStatusEnum = pgEnum("challengeStatus", [
  "waiting",
  "active",
  "finished",
  "cancelled",
]);

export const participantStatusEnum = pgEnum("participantStatus", [
  "joined",
  "submitted",
]);

export const challenge = pgTable(
  "challenge",
  {
    ...baseSchema,
    code: varchar("code", {length: 12}).notNull().unique(),
    problemId: uuid("problemId")
      .notNull()
      .references(() => problem.id, {onDelete: "restrict"}),
    creatorId: uuid("creatorId")
      .notNull()
      .references(() => user.id, {onDelete: "cascade"}),
    mode: challengeModeEnum("mode").notNull().default("1v1"),
    maxParticipants: integer("maxParticipants").notNull().default(2),
    status: challengeStatusEnum("status").notNull().default("waiting"),
    startedAt: timestamp("startedAt"),
    endsAt: timestamp("endsAt"),
    durationSeconds: integer("durationSeconds").notNull().default(3600),
  },
  (t) => ({
    statusIdx: index("challengeStatusIdx").on(t.status),
    codeIdx: index("challengeCodeIdx").on(t.code),
  }),
);

export const challengeParticipant = pgTable(
  "challengeParticipant",
  {
    ...baseSchema,
    challengeId: uuid("challengeId")
      .notNull()
      .references(() => challenge.id, {onDelete: "cascade"}),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, {onDelete: "cascade"}),
    status: participantStatusEnum("status").notNull().default("joined"),
    submissionId: uuid("submissionId").references(() => submission.id),
    rank: integer("rank"),
    finishedAt: timestamp("finishedAt"),
  },
  (t) => ({
    uniqueParticipant: uniqueIndex("challengeParticipantUniqueIdx").on(
      t.challengeId,
      t.userId,
    ),
    challengeIdx: index("challengeParticipantChallengeIdx").on(t.challengeId),
  }),
);
