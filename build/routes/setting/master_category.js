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
exports.SettingMasterCategoryController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SettingMasterCategoryController {
    static get(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code = "", name = "", status, limit, offset, } = ctx.query;
            const result = yield prisma.masterCategory.findMany({
                include: {
                    master_datas: true,
                    master_category_children: true,
                    master_category_parent: true,
                },
                where: Object.assign(Object.assign(Object.assign({}, (code && { code: { contains: code } })), (name && { name: { contains: name } })), (status && { status: status })),
                // ...(limit !== 0 && { take: +limit }),
                // ...(offset !== 0 && { skip: +offset }),
            });
            return (ctx.body = { success: true, data: result });
        });
    }
    static create(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { master_category_id = 0, code = "", name = "", description = "", status = "active", } = JSON.parse(JSON.stringify(ctx.request.body));
                if (code == "")
                    ctx.throw("Code required", 400);
                if (name == "")
                    ctx.throw("Name required", 400);
                const result = yield prisma.masterCategory.create({
                    data: Object.assign(Object.assign({ description: description }, (master_category_id != 0 && {
                        master_category_id: +master_category_id,
                    })), { status: status, code: code, name: name }),
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil membuat Master Category dengan nama " + name,
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
    static update(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id = 0 } = ctx.params;
                const { master_category_id = 0, code = "", name = "", description = "", status = "active", } = JSON.parse(JSON.stringify(ctx.request.body));
                if (id == 0)
                    ctx.throw("ID Required", 400);
                if (code == "")
                    ctx.throw("Code required", 400);
                if (name == "")
                    ctx.throw("Name required", 400);
                const result = yield prisma.masterCategory.update({
                    where: {
                        id: +id,
                    },
                    data: Object.assign(Object.assign({ code: code, name: name, description: description }, (master_category_id != 0 && {
                        master_category_id: +master_category_id,
                    })), { status: status }),
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil membuat Master Category dengan nama " + name,
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
    static delete(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id = 0 } = ctx.params;
                if (id == 0)
                    ctx.throw("ID is required", 400);
                const result = yield prisma.masterCategory.delete({
                    where: { id: +id },
                });
                ctx.status = 200;
                return (ctx.body = {
                    success: true,
                    message: "Berhasil menghapus Master Category",
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
exports.SettingMasterCategoryController = SettingMasterCategoryController;
