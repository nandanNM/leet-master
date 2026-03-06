import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";

import * as authSchema from "./schema/auth-schema";
import * as schema from "./schema";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000, // closes idle connection after 30 secs
  connectionTimeoutMillis: 10000, // timeout after 10 secs if connection could not be established
  allowExitOnIdle: false,
});

export const db = drizzle(pool, {
  schema: {...schema, ...authSchema},
});
