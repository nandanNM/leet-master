// schema has been human tested and perfect as per requirements
import {relations} from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import {v7} from "uuid";

export const baseSchema = {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
};

export const userTable = pgTable(
  "user",
  {
    ...baseSchema,
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    bio: text("bio"),
    emailVerified: boolean("emailVerified").default(false).notNull(),
    image: text("image"),
    role: text("role"),
    banned: boolean("banned").default(false),
    banReason: text("banReason"),
    banExpires: timestamp("banExpires"),
    isActive: boolean("isActive"),
    disabledAt: timestamp("disabledAt"),
  },
  (table) => [
    // unique email
  ],
);

export const sessionTable = pgTable(
  "session",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => v7()), // Keep it text only because drizzle doesn't support uuid for session id
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: uuid("userId") //use uuid type for foreign key references
      .notNull()
      .references(() => userTable.id, {onDelete: "cascade"}),
    impersonatedBy: text("impersonatedBy"),
  },
  (table) => [index("sessionUserIdIdx").on(table.userId)],
);

export const accountTable = pgTable(
  "account",
  {
    ...baseSchema,
    accountId: uuid("accountId")
      .notNull()
      .$defaultFn(() => v7()), //use uuid type for foreign key references
    providerId: text("providerId").notNull(),
    userId: uuid("userId") //use uuid type for foreign key references
      .notNull()
      .references(() => userTable.id, {onDelete: "cascade"}),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
  },
  (table) => [index("accountUserIdIdx").on(table.userId)],
);

export const verificationTable = pgTable(
  "verification",
  {
    ...baseSchema,
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
  },
  (table) => [index("verificationIdentifierIdx").on(table.identifier)],
);

export const userRelations = relations(userTable, ({many}) => ({
  sessions: many(sessionTable),
  accounts: many(accountTable),
}));

export const sessionRelations = relations(sessionTable, ({one}) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const accountRelations = relations(accountTable, ({one}) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}));
