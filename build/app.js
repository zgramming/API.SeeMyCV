"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_json_1 = __importDefault(require("koa-json"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_static_1 = __importDefault(require("koa-static"));
const router_1 = __importDefault(require("./router"));
const cors = require("@koa/cors");
const app = new koa_1.default();
require("dotenv").config();
// const multer = require("@koa/multer");
// app.use(multer());
app.use((0, koa_body_1.default)({ multipart: true }));
app.use(cors());
app.use((0, koa_json_1.default)());
app.use((0, koa_logger_1.default)());
/// Make folder file accessible via url
app.use((0, koa_static_1.default)("./public"));
app.use(router_1.default.routes()).use(router_1.default.allowedMethods());
app.listen(process.env.PORT, () => {
    console.log("Koa server is started on " + process.env.PORT);
});
