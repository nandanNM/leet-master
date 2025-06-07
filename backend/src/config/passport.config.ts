import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import "dotenv/config";
import {Request} from "express";
import {eq} from "drizzle-orm";
import {usersTable} from "../db/schema";
import {db} from "../db";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile,
      done: VerifyCallback,
    ) => {
      console.log("--- Passport Google Strategy Callback Started ---");
      console.log("Profile ID:", profile.id);
      console.log("Profile Emails:", profile.emails);
      console.log("Profile DisplayName:", profile.displayName);
      console.log("Profile Photos:", profile.photos);
      try {
        const email = profile?.emails?.[0]?.value;
        const displayName = profile.displayName || "";
        const photo = profile.photos?.[0]?.value;
        console.log(req, accessToken, refreshToken);
        if (!email) {
          throw new Error("Email not provided by Google");
        }

        const user = await db.query.usersTable.findFirst({
          where: eq(usersTable.email, email),
          columns: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
            role: true,
          },
        });

        if (user) {
          if (!user.avatar && photo) {
            const [updateUser] = await db
              .update(usersTable)
              .set({
                avatar: photo,
              })
              .where(eq(usersTable.id, user.id))
              .returning({
                id: usersTable.id,
                email: usersTable.email,
                name: usersTable.name,
                avatar: usersTable.avatar,
                bio: usersTable.bio,
                role: usersTable.role,
              });
            if (!updateUser) return done(null, false);
            return done(null, updateUser);
          }
          return done(null, user);
        }
        const [newUser] = await db
          .insert(usersTable)
          .values({
            name: displayName,
            email,
            avatar: photo,
            authProvider: "google",
          })
          .returning({
            id: usersTable.id,
            email: usersTable.email,
            name: usersTable.name,
            avatar: usersTable.avatar,
            bio: usersTable.bio,
            role: usersTable.role,
          });
        return done(null, newUser);
      } catch (error) {
        done(
          error instanceof Error ? error : new Error("Authentication failed"),
        );
      }
    },
  ),
);

export default passport;
