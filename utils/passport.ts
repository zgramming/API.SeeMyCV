import passport from "koa-passport";
import GoogleOauth, {
  GoogleCallbackParameters,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";

const googleStrategy = new GoogleOauth.Strategy(
  {
    clientID: process.env.GOOGLE_OAUTH_CLIENTID ?? "",
    clientSecret: process.env.GOOGLE_OAUTH_CLIENTSECRET ?? "",
    callbackURL: process.env.GOOGLE_OAUTH_CALLBACKURL ?? "",
    scope: ["profile", "email"],
  },
  (
    accessToken: string,
    refreshToken: string,
    params: GoogleCallbackParameters,
    profile: Profile,
    done: VerifyCallback
  ) => {
    console.log({ googlecallback: profile });
    done(null, profile);
  }
);

passport.use(googleStrategy);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user: any, done) => {
  done(null, user);
});
