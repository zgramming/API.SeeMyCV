"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.destroyCookiesUser = exports.setCookiesUser = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const constant_1 = require("./constant");
const setCookiesUser = (ctx, user) => {
    const isDev = process.env.APP_ENV == "dev";
    const baseDomain = isDev ? undefined : process.env.BASE_DOMAIN;
    const token = (0, exports.generateToken)(user);
    ctx.cookies.set(constant_1.keyCookieAuth, token, {
        path: "/",
        sameSite: isDev ? undefined : "none",
        domain: baseDomain,
        /// httpOnly[false] make cookie can be access in client side
        httpOnly: false,
        secure: isDev ? false : true,
    });
    return true;
};
exports.setCookiesUser = setCookiesUser;
const destroyCookiesUser = (ctx) => {
    const isDev = process.env.APP_ENV == "dev";
    const baseDomain = isDev ? undefined : process.env.BASE_DOMAIN;
    ctx.cookies.set(constant_1.keyCookieAuth, "", {
        path: "/",
        sameSite: isDev ? undefined : "none",
        domain: baseDomain,
        /// httpOnly[false] make cookie can be access in client side
        httpOnly: false,
        secure: isDev ? false : true,
        expires: new Date(),
    });
    return true;
};
exports.destroyCookiesUser = destroyCookiesUser;
const generateToken = (user) => {
    var _a;
    const secretKey = (_a = process.env.JWT_SECRECT_KEY) !== null && _a !== void 0 ? _a : "-";
    const token = jsonwebtoken_1.default.sign({
        payload: {
            user,
        },
    }, secretKey, { expiresIn: "1 days" });
    //   const decode = jwt.decode(token) as JwtPayload;
    //   console.log({ token, decode: decode.payload });
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (ctx, next) => {
    var _a, _b, _c, _d;
    // return next();
    try {
        const secretKey = (_a = process.env.JWT_SECRECT_KEY) !== null && _a !== void 0 ? _a : "-";
        const [authMethod, token] = (_c = (_b = ctx.headers["authorization"]) === null || _b === void 0 ? void 0 : _b.split(" ")) !== null && _c !== void 0 ? _c : [];
        if (!token) {
            ctx.status = 401;
            return (ctx.body = {
                message: "Unauthorized, Token required",
            });
        }
        const verify = jsonwebtoken_1.default.verify(token, secretKey);
        /// key[payload] didapat dari config jwt.sign();
        const { payload, iat, exp } = verify;
        const { user } = payload;
        if (!user) {
            ctx.status = 403;
            return (ctx.body = {
                message: "Token invalid",
                success: false,
            });
        }
        return next();
    }
    catch (error) {
        ctx.status = 500;
        let data = {
            message: (_d = error === null || error === void 0 ? void 0 : error.message) !== null && _d !== void 0 ? _d : "Unknown Message Error",
        };
        if (error instanceof jsonwebtoken_1.JsonWebTokenError ||
            error instanceof jsonwebtoken_1.TokenExpiredError) {
            ctx.status = 403;
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                /// Remove token from cookie
                /// And force user to login again
            }
            data = Object.assign(Object.assign({}, data), { message: error.message, stackTrace: error.stack });
        }
        return (ctx.body = data);
    }
};
exports.verifyToken = verifyToken;
