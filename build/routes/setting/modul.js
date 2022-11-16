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
exports.SettingModulController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SettingModulController {
    static getModul(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code = "", name = "", pattern = "", status, limit, offset, } = ctx.query;
            const result = yield prisma.appModul.findMany({
                where: Object.assign(Object.assign(Object.assign(Object.assign({}, (code && { code: { contains: code } })), (name && { name: { contains: name } })), (pattern && { pattern: pattern })), (status && { status: status })),
                include: {
                    menus: true,
                    access_menu: true,
                    access_modul: true,
                },
                // ...(limit !== 0 && { take: +limit }),
                // ...(offset !== 0 && { skip: +offset }),
            });
            return (ctx.body = { success: true, data: result });
        });
    }
    static createModul(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code = "", name = "", pattern = "", icon = "", order = 0, status = "active", } = JSON.parse(JSON.stringify(ctx.request.body));
                if (code == "")
                    ctx.throw("Code required", 400);
                if (name == "")
                    ctx.throw("Name required", 400);
                if (pattern == "")
                    ctx.throw("Pattern required", 400);
                const result = yield prisma.appModul.create({
                    data: {
                        code,
                        name,
                        pattern,
                        icon,
                        order: +order,
                        status,
                    },
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil membuat modul dengan nama " + name,
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
    static updateModul(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id = 0 } = ctx.params;
                const { code = "", name = "", pattern = "", icon = "", order = 0, status = "active", } = JSON.parse(JSON.stringify(ctx.request.body));
                if (id == 0)
                    ctx.throw("ID Required", 400);
                if (code == "")
                    ctx.throw("Code required", 400);
                if (name == "")
                    ctx.throw("Name required", 400);
                if (pattern == "")
                    ctx.throw("Pattern required", 400);
                const result = yield prisma.appModul.update({
                    where: { id: +id },
                    data: {
                        code,
                        name,
                        pattern,
                        icon,
                        order: +order,
                        status,
                    },
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil mengupdate modul dengan nama " + name,
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
    static deleteModul(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id = 0 } = ctx.params;
                if (id == 0)
                    ctx.throw("ID is required", 400);
                const result = yield prisma.appModul.delete({
                    where: { id: +id },
                });
                ctx.status = 200;
                return (ctx.body = {
                    success: true,
                    message: "Berhasil menghapus modul",
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
exports.SettingModulController = SettingModulController;
