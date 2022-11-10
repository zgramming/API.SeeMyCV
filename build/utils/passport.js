"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const koa_passport_1 = __importDefault(require("koa-passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const googleStrategy = new passport_google_oauth20_1.default.Strategy({
    clientID: (_a = process.env.GOOGLE_OAUTH_CLIENTID) !== null && _a !== void 0 ? _a : "",
    clientSecret: (_b = process.env.GOOGLE_OAUTH_CLIENTSECRET) !== null && _b !== void 0 ? _b : "",
    callbackURL: (_c = process.env.GOOGLE_OAUTH_CALLBACKURL) !== null && _c !== void 0 ? _c : "",
    scope: ["profile", "email"],
}, (accessToken, refreshToken, params, profile, done) => {
    console.log({ googlecallback: profile });
    done(null, profile);
});
koa_passport_1.default.use(googleStrategy);
koa_passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
koa_passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
