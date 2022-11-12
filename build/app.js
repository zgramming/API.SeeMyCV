"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_json_1 = __importDefault(require("koa-json"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_passport_1 = __importDefault(require("koa-passport"));
const koa_session_1 = __importDefault(require("koa-session"));
const koa_static_1 = __importDefault(require("koa-static"));
const cors_1 = __importDefault(require("@koa/cors"));
const router_1 = __importDefault(require("./router"));
const app = new koa_1.default();
require("dotenv").config();
require("./utils/passport");
/// Passport initialize
app.keys = [(_a = process.env.KOA_SESSION_SECRET) !== null && _a !== void 0 ? _a : ""];
app.use((0, koa_session_1.default)({}, app));
app.use(koa_passport_1.default.initialize());
app.use(koa_passport_1.default.session());
app.use((0, koa_body_1.default)({
    multipart: true,
}));
app.use((0, cors_1.default)());
app.use((0, koa_json_1.default)());
app.use((0, koa_logger_1.default)());
/// Make folder file accessible via url
app.use((0, koa_static_1.default)("./public"));
app.use(router_1.default.routes()).use(router_1.default.allowedMethods());
app.listen(process.env.PORT, () => {
    console.log("Koa server is started on " + process.env.PORT);
});
