import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {admin, openAPI} from "better-auth/plugins";
import {db} from "src/db";

import {
  accountTable,
  sessionTable,
  userTable,
  verificationTable,
} from "../db/schema";

export const auth = betterAuth({
  baseURL: process.env.BACKEND_URL || "http://localhost:8080",
  database: drizzleAdapter(db, {
    provider: "pg",
    debugLogs: false,
    // better-auth expects schema keys matching its internal model names
    schema: {
      user: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable,
    },
  }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: false,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  advanced: {
    cookiePrefix: "leet-master",
    useSecureCookies: process.env.NODE_ENV === "production",
    database: {
      generateId: false,
    },
  },

  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
        // Currently, better-auth does not support foreign key constraints in drizzle adapter
        // If supported in future, add back the foreign key constraint
        // else them manually in the generated auth schema
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],

  plugins: [
    openAPI(),
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});
