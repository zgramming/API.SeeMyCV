"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const koa_passport_1 = __importDefault(require("koa-passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const saltRounds = 10;
const googleStrategy = new passport_google_oauth20_1.default.Strategy({
    clientID: (_a = process.env.GOOGLE_OAUTH_CLIENTID) !== null && _a !== void 0 ? _a : "",
    clientSecret: (_b = process.env.GOOGLE_OAUTH_CLIENTSECRET) !== null && _b !== void 0 ? _b : "",
    callbackURL: (_c = process.env.GOOGLE_OAUTH_CALLBACKURL) !== null && _c !== void 0 ? _c : "",
    scope: ["profile", "email"],
    passReqToCallback: true,
}, (req, acecssToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const { emails, id, displayName, profileUrl, provider, name, photos, username, } = profile;
    if (!emails) {
        return done(new Error("Email tidak valid"), profile);
    }
    const emailObj = emails[0];
    if (emailObj.verified == "false") {
        return done(new Error("Email not verified"), profile);
    }
    const userDatabase = yield prisma.users.findFirst({
        where: { email: emailObj.value },
    });
    /// IF NOT EXISTS, INSERT TO DATABASE
    if (!userDatabase) {
        const superadminEmail = "seemycv.superuser@gmail.com";
        const isSuperadmin = superadminEmail === emailObj.value;
        const codeUser = isSuperadmin ? "superadmin" : "user";
        const groupUser = yield prisma.appGroupUser.findFirstOrThrow({
            where: {
                code: codeUser,
            },
        });
        const create = yield prisma.users.create({
            data: {
                email: emailObj.value,
                name: emailObj.value,
                status: "active",
                password: (0, bcrypt_1.hashSync)(emailObj.value, saltRounds),
                username: emailObj.value,
                app_group_user_id: groupUser.id,
            },
        });
        return done(null, create);
    }
    return done(null, userDatabase);
}));
koa_passport_1.default.use(googleStrategy);
koa_passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
koa_passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
