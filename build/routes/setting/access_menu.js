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
exports.SettingAccessMenuController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SettingAccessMenuController {
    static get(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { app_group_user_id = 0, app_modul_id = 0, app_menu_id = 0, } = ctx.query;
            const result = yield prisma.appAccessMenu.findMany({
                include: {
                    app_modul: true,
                    app_menu: true,
                    app_group_user: true,
                },
                where: Object.assign(Object.assign(Object.assign({}, (app_group_user_id != 0 && {
                    app_group_user_id: +app_group_user_id,
                })), (app_modul_id != 0 && { app_modul_id: +app_modul_id })), (app_menu_id != 0 && { app_menu_id: +app_menu_id })),
            });
            return (ctx.body = { success: true, data: result });
        });
    }
    static getByUserGroup(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { app_group_user_id } = ctx.params;
            const { route } = ctx.query;
            const routeModul = !route
                ? undefined
                : "/" + route.split("/").filter((val) => val !== "")[0];
            const result = yield prisma.appAccessMenu.findMany({
                include: {
                    app_group_user: true,
                    app_menu: {
                        include: { menu_childrens: true },
                    },
                    app_modul: true,
                },
                where: {
                    app_group_user_id: +(app_group_user_id !== null && app_group_user_id !== void 0 ? app_group_user_id : 0),
                    app_modul: { pattern: routeModul },
                },
                orderBy: {
                    app_menu: { order: "asc" },
                },
            });
            return (ctx.body = { success: true, data: result });
        });
    }
    static create(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { app_group_user_id = 0, access_menu = [], } = JSON.parse(JSON.stringify(ctx.request.body));
                const removeAll = yield prisma.appAccessMenu.deleteMany({
                    where: {
                        app_group_user_id: +app_group_user_id,
                    },
                });
                const data = access_menu
                    .map((val) => {
                    var _a, _b, _c;
                    return {
                        app_group_user_id: +app_group_user_id,
                        app_menu_id: +((_a = val.app_menu_id) !== null && _a !== void 0 ? _a : 0),
                        app_modul_id: +((_b = val.app_modul_id) !== null && _b !== void 0 ? _b : 0),
                        allowed_access: (_c = val.allowed_access) !== null && _c !== void 0 ? _c : [],
                    };
                })
                    .filter((val) => val.allowed_access.length != 0);
                const result = yield prisma.appAccessMenu.createMany({
                    data: data,
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil membuat access menu",
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
exports.SettingAccessMenuController = SettingAccessMenuController;
