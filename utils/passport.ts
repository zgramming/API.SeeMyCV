import { hashSync } from "bcrypt";
import passport from "koa-passport";
import GoogleOauth from "passport-google-oauth20";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const saltRounds = 10;

const googleStrategy = new GoogleOauth.Strategy(
  {
    clientID: process.env.GOOGLE_OAUTH_CLIENTID ?? "",
    clientSecret: process.env.GOOGLE_OAUTH_CLIENTSECRET ?? "",
    callbackURL: process.env.GOOGLE_OAUTH_CALLBACKURL ?? "",
    scope: ["profile", "email"],
    passReqToCallback: true,
  },
  async (req, acecssToken, refreshToken, profile, done) => {
    const {
      emails,
      id,
      displayName,
      profileUrl,
      provider,
      name,
      photos,
      username,
    } = profile;
    if (!emails) {
      return done(new Error("Email tidak valid"), profile);
    }

    const emailObj = emails![0];

    if (emailObj.verified == "false") {
      return done(new Error("Email not yet verified"), profile);
    }

    const userDatabase = await prisma.users.findFirst({
      where: { email: emailObj.value },
    });

    /// IF NOT EXISTS, INSERT TO DATABASE
    if (!userDatabase) {
      const groupUser = await prisma.appGroupUser.findFirstOrThrow({
        where: {
          code: "user",
        },
      });
      const create = await prisma.users.create({
        data: {
          email: emailObj.value,
          name: emailObj.value,
          status: "active",
          password: hashSync(emailObj.value, saltRounds),
          username: emailObj.value,
          app_group_user_id: groupUser.id,
        },
      });

      return done(null, create);
    }

    return done(null, userDatabase);
  }
);

passport.use(googleStrategy);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user: any, done) => {
  done(null, user);
});
