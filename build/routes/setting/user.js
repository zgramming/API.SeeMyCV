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
exports.SettingUserController = void 0;
const bcrypt_1 = require("bcrypt");
const fastest_validator_1 = __importDefault(require("fastest-validator"));
const client_1 = require("@prisma/client");
const constant_1 = require("../../utils/constant");
const validator = new fastest_validator_1.default();
const prisma = new client_1.PrismaClient();
const saltRounds = 10;
class SettingUserController {
    static getUsers(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, name, app_group_user_id = 0, status, limit, offset, } = ctx.query;
            const users = yield prisma.users.findMany({
                include: {
                    app_group_user: true,
                },
                where: Object.assign(Object.assign(Object.assign(Object.assign({}, (username && { username: { contains: username } })), (name && { name: { contains: name } })), (status && { status: status })), (app_group_user_id != 0 && {
                    app_group_user_id: +app_group_user_id,
                })),
                // ...(limit !== 0 && { take: +limit }),
                // ...(offset !== 0 && { skip: +offset }),
            });
            return (ctx.body = { success: true, data: users });
        });
    }
    static createUsers(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { app_group_user_id = 0, name = "", email = "", username = "", password = "", status = "active", } = JSON.parse(JSON.stringify(ctx.request.body));
                if (app_group_user_id == 0)
                    ctx.throw("Group User required", 400);
                if (name == "")
                    ctx.throw("Nama required", 400);
                if (email == "")
                    ctx.throw("Email required", 400);
                if (username == "")
                    ctx.throw("Username required", 400);
                if (password == "")
                    ctx.throw("Password required", 400);
                const result = yield prisma.users.create({
                    data: {
                        email: email,
                        name: name,
                        password: (0, bcrypt_1.hashSync)(password, saltRounds),
                        username: username,
                        app_group_user_id: +app_group_user_id,
                        status: status,
                    },
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil membuat user dengan nama " + name,
                });
            }
            catch (error) {
                ctx.status = error.statusCode || error.status || 500;
                return (ctx.body = {
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    static updateUsers(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id = 0 } = ctx.params;
                const { app_group_user_id = 0, name = "", email = "", username = "", password = "", status = "active", } = JSON.parse(JSON.stringify(ctx.request.body));
                if (id == 0)
                    ctx.throw("ID Required", 400);
                if (app_group_user_id == 0)
                    ctx.throw("Group User required", 400);
                if (name == "")
                    ctx.throw("Nama required", 400);
                if (email == "")
                    ctx.throw("Email required", 400);
                if (username == "")
                    ctx.throw("Username required", 400);
                if (password == "")
                    ctx.throw("Password required", 400);
                const result = yield prisma.users.update({
                    where: {
                        id: +id,
                    },
                    data: {
                        email: email,
                        name: name,
                        password: (0, bcrypt_1.hashSync)(password, saltRounds),
                        username: username,
                        app_group_user_id: +app_group_user_id,
                        status: status,
                    },
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil mengupdate user dengan nama " + name,
                });
            }
            catch (error) {
                ctx.status = error.statusCode || error.status || 500;
                return (ctx.body = {
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    static updateNameUsers(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const { name } = ctx.request.body;
                const user = yield prisma.users.findFirstOrThrow({
                    where: { id: +id },
                });
                const schema = {
                    name: { type: "string", empty: false },
                };
                const createSchema = validator.compile(schema);
                const check = yield createSchema({
                    name,
                });
                if (check !== true) {
                    ctx.status = 400;
                    return (ctx.body = {
                        success: false,
                        type: constant_1.ERROR_TYPE_VALIDATION,
                        message: check,
                    });
                }
                const update = yield prisma.users.update({
                    where: { id: user.id },
                    data: Object.assign(Object.assign({}, user), { name: name }),
                });
                ctx.status = 200;
                return (ctx.body = {
                    success: true,
                    message: "Berhasil mengupdate nama menjadi " + name,
                    data: update,
                });
            }
            catch (error) {
                console.log({ error: error });
                ctx.status = error.statusCode || error.status || 500;
                return (ctx.body = {
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    static deleteUsers(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id = 0 } = ctx.params;
                if (id == 0)
                    ctx.throw("ID is required", 400);
                const result = yield prisma.users.delete({
                    where: { id: +id },
                });
                ctx.status = 200;
                return (ctx.body = {
                    success: true,
                    message: "Berhasil menghapus user",
                    data: result,
                });
            }
            catch (error) {
                ctx.status = error.statusCode || error.status || 500;
                return (ctx.body = {
                    success: false,
                    message: error.message,
                });
            }
        });
    }
}
exports.SettingUserController = SettingUserController;
