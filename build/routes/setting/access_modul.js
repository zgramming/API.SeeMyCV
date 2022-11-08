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
exports.SettingAccessModulController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SettingAccessModulController {
    static get(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { app_group_user_id = 0, } = ctx.query;
            const result = yield prisma.appAccessModul.findMany({
                include: {
                    app_group_user: true,
                    app_modul: true,
                },
                where: Object.assign({}, (app_group_user_id && { app_group_user_id: +app_group_user_id })),
            });
            return (ctx.body = { success: true, data: result });
        });
    }
    static getByUserGroup(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { app_group_user_id } = ctx.params;
            const result = yield prisma.appAccessModul.findMany({
                where: {
                    app_group_user_id: +(app_group_user_id !== null && app_group_user_id !== void 0 ? app_group_user_id : "0"),
                },
                include: {
                    app_group_user: true,
                    app_modul: {
                        include: { menus: true, access_menu: true, access_modul: true },
                    },
                },
                orderBy: {
                    app_modul: {
                        order: "asc",
                    },
                },
            });
            return (ctx.body = {
                data: result,
            });
        });
    }
    static create(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { app_group_user_id = 0, access_modul = [], } = JSON.parse(JSON.stringify(ctx.request.body));
                const removeAll = yield prisma.appAccessModul.deleteMany({
                    where: {
                        app_group_user_id: +app_group_user_id,
                    },
                });
                const result = yield prisma.appAccessModul.createMany({
                    data: access_modul.map((val) => {
                        return {
                            app_group_user_id: +app_group_user_id,
                            app_modul_id: +val,
                        };
                    }),
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil membuat access modul",
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
exports.SettingAccessModulController = SettingAccessModulController;
