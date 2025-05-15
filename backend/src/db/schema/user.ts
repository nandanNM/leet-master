import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
export const rolesEnum = pgEnum("role", ["admin", "user"]);

export const usersTable = table("users", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  email: t.varchar({ length: 255 }).notNull().unique(),
  password: t.varchar({ length: 255 }),
  image: t.text("image"),
  role: rolesEnum().default("user").notNull(),

  createdAt: t.timestamp("created_at").defaultNow(),
  updatedAt: t
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
