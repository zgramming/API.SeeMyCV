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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingUserGroupController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SettingUserGroupController {
    static getUserGroup(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, status, code, limit, offset, } = ctx.query;
            const userGroup = yield prisma.appGroupUser.findMany({
                where: Object.assign(Object.assign({}, (name && { name: name })), (status && { status: status })),
                include: {
                    user: true,
                    access_menu: true,
                    access_modul: true,
                },
                // ...(limit !== 0 && { take: +limit }),
                // ...(offset !== 0 && { skip: 10 }),
            });
            return (ctx.body = { success: true, data: userGroup });
        });
    }
    static createUserGroup(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, name, status = "active", } = JSON.parse(JSON.stringify(ctx.request.body));
                if (code == "")
                    ctx.throw("Code is required", 400);
                if (name == "")
                    ctx.throw("Name is required", 400);
                const result = yield prisma.appGroupUser.create({
                    data: {
                        code: code !== null && code !== void 0 ? code : "",
                        name: name !== null && name !== void 0 ? name : "",
                        status,
                    },
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil membuat user group",
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
    static updateUserGroup(ctx, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id = 0 } = ctx.params;
                const { code, name, status = "active", } = JSON.parse(JSON.stringify(ctx.request.body));
                if (id == 0)
                    ctx.throw("ID is required", 400);
                if (code == "")
                    ctx.throw("Code is required", 400);
                if (name == "")
                    ctx.throw("Name is required", 400);
                const result = yield prisma.appGroupUser.update({
                    where: {
                        id: (_a = +id) !== null && _a !== void 0 ? _a : 0,
                    },
                    data: {
                        code: code,
                        name: name,
                        status,
                    },
                });
                ctx.status = 200;
                return (ctx.body = {
                    success: true,
                    message: "Berhasil mengupdate nama menjadi " + name,
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
    static deleteUserGroup(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id = 0 } = ctx.params;
                if (id == 0)
                    ctx.throw("ID is required", 400);
                const result = yield prisma.appGroupUser.delete({
                    where: {
                        id: +id,
                    },
                });
                ctx.status = 200;
                return (ctx.body = {
                    success: true,
                    message: "Berhasil menghapus user group",
                    data: result,
                });
            }
            catch (error) {
                ctx.status = error.statusCode || error.status || 500;
                return (ctx.body = {
                    success: false,
                    message: error.message,
                    apasih: "gajelas",
                });
            }
        });
    }
}
exports.SettingUserGroupController = SettingUserGroupController;
