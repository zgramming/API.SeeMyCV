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
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const prisma = new client_1.PrismaClient();
const LoginRouter = new koa_router_1.default({ prefix: "/api/login" });
LoginRouter.post("/", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { username, password } = ctx.request.body;
        const user = yield prisma.users.findFirst({
            where: {
                username,
            },
            include: {
                app_group_user: {
                    include: {
                        access_menu: {
                            include: {
                                app_menu: true,
                            },
                        },
                    },
                },
            },
        });
        const checkPassword = yield (0, bcrypt_1.compare)(password, (_a = user === null || user === void 0 ? void 0 : user.password) !== null && _a !== void 0 ? _a : "");
        if (!user || !checkPassword) {
            ctx.throw(`Username ${username} atau password tidak valid`, 400);
        }
        if ((user === null || user === void 0 ? void 0 : user.status) != "active") {
            if ((user === null || user === void 0 ? void 0 : user.status) == "blocked") {
                ctx.throw(`Akun dengan username ${username} terblokir`, 403);
            }
            else if ((user === null || user === void 0 ? void 0 : user.status) == "process_verification") {
                ctx.throw(`Silahkan lanjutkan proses verifikasi email terlebih dahulu`, 403);
            }
            else {
                ctx.throw(`Akun tidak aktif, silahkan hubungin admin untuk proses pemulihan akun`, 403);
            }
        }
        const accessMenu = user.app_group_user.access_menu;
        if (accessMenu.length == 0) {
            ctx.throw(`Username ${username} tidak mempunyai hak akses menu di aplikasi, silahkan hubungi admin`, 403);
        }
        accessMenu.sort((a, b) => a.app_menu.order - b.app_menu.order);
        const firstRoute = accessMenu[0].app_menu.route;
        const resultUser = yield prisma.users.findFirst({
            where: { username },
        });
        ctx.body = {
            success: true,
            message: "Success login",
            data: {
                route: firstRoute,
                user: resultUser,
            },
        };
    }
    catch (error) {
        ctx.status = error.statusCode || error.status || 500;
        ctx.body = {
            success: false,
            message: error.message,
        };
    }
}));
exports.default = LoginRouter;
