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
exports.SettingMenuController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SettingMenuController {
    static getMenu(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { app_modul_id = 0, name = "", code = "", status = "", limit, offset, } = ctx.query;
            const result = yield prisma.appMenu.findMany(Object.assign(Object.assign(Object.assign({ where: Object.assign(Object.assign(Object.assign(Object.assign({}, (app_modul_id && { app_modul_id: +app_modul_id })), (name && { name: { contains: name } })), (code && { code: { contains: code } })), (status && { status: { contains: status } })) }, (limit && limit != 0 && { take: +limit })), (offset && offset != 0 && { skip: +offset })), { include: {
                    menu_parent: true,
                    app_modul: true,
                    access_menu: true,
                    menu_childrens: true,
                }, orderBy: [
                    {
                        app_modul_id: "asc",
                    },
                    { order: "asc" },
                ] }));
            return (ctx.body = { success: true, data: result });
        });
    }
    static createMenu(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { app_modul_id = 0, app_menu_id_parent, code = "", name = "", route = "", order = 0, icon, status = "active", } = JSON.parse(JSON.stringify(ctx.request.body));
                if (app_modul_id == 0)
                    ctx.throw("Modul required", 400);
                if (code == "")
                    ctx.throw("Code required", 400);
                if (name == "")
                    ctx.throw("Name required", 400);
                if (route == "")
                    ctx.throw("Route required", 400);
                const result = yield prisma.appMenu.create({
                    data: {
                        app_modul_id: +app_modul_id,
                        app_menu_id_parent: app_menu_id_parent && +app_menu_id_parent,
                        code: code,
                        name: name,
                        route: route,
                        icon: icon,
                        order: +order,
                        status: status,
                    },
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil membuat menu dengan nama " + name,
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
    static updateMenu(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id = 0 } = ctx.params;
                const { app_modul_id = 0, app_menu_id_parent = 0, code = "", name = "", route = "", order = 0, icon, status = "active", } = JSON.parse(JSON.stringify(ctx.request.body));
                if (id == 0)
                    ctx.throw("ID required", 400);
                if (app_modul_id == 0)
                    ctx.throw("Modul required", 400);
                if (code == "")
                    ctx.throw("Code required", 400);
                if (name == "")
                    ctx.throw("Name required", 400);
                if (route == "")
                    ctx.throw("Route required", 400);
                const result = yield prisma.appMenu.update({
                    where: { id: +id },
                    data: Object.assign(Object.assign({ app_modul_id: +app_modul_id }, (app_menu_id_parent && {
                        app_menu_id_parent: app_menu_id_parent,
                    })), { code: code, name: name, route: route, icon: icon, order: +order, status: status }),
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil mengupdate menu dengan nama " + name,
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
    static deleteMenu(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id = 0 } = ctx.params;
                if (id == 0)
                    ctx.throw("ID is required", 400);
                const result = yield prisma.appMenu.delete({
                    where: { id: +id },
                });
                ctx.status = 200;
                return (ctx.body = {
                    success: true,
                    message: "Berhasil menghapus Menu",
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
exports.SettingMenuController = SettingMenuController;
