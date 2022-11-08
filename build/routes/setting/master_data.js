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
exports.SettingMasterDataController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SettingMasterDataController {
    static get(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { master_category_id, master_category_code, code, name, status, limit, offset, } = ctx.query;
            const result = yield prisma.masterData.findMany({
                where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (master_category_code && {
                    master_category_code: master_category_code,
                })), (master_category_id && { master_category_id: +master_category_id })), (code && { code: code })), (name && { name: name })), (status && { status: status })),
                include: {
                    master_category: true,
                    master_data_children: true,
                    master_data_parent: true,
                },
                // ...(limit !== 0 && { take: +limit }),
                // ...(offset !== 0 && { skip: +offset }),
            });
            return (ctx.body = { success: true, data: result });
        });
    }
    static create(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { master_data_id, master_category_code = "", code = "", name = "", description = "", status = "active", parameter1_key, parameter1_value, parameter2_key, parameter2_value, parameter3_key, parameter3_value, } = JSON.parse(JSON.stringify(ctx.request.body));
                if (master_category_code == "") {
                    ctx.throw("Master Data Required", 400);
                }
                if (code == "")
                    ctx.throw("Code required", 400);
                if (name == "")
                    ctx.throw("Name required", 400);
                const masterCategory = yield prisma.masterCategory.findFirst({
                    where: { code: master_category_code },
                });
                if (!masterCategory)
                    ctx.throw("Master Kategori tidak valid", 400);
                const result = yield prisma.masterData.create({
                    data: {
                        master_data_id: master_data_id && +master_data_id,
                        master_category_id: +masterCategory.id,
                        master_category_code: masterCategory.code,
                        code,
                        name,
                        description,
                        status: status,
                        parameter1_key,
                        parameter1_value,
                        parameter2_key,
                        parameter2_value,
                        parameter3_key,
                        parameter3_value,
                    },
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil membuat Master Data dengan nama " + name,
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
                const { master_data_id, code = "", name = "", description = "", status = "active", parameter1_key, parameter1_value, parameter2_key, parameter2_value, parameter3_key, parameter3_value, } = JSON.parse(JSON.stringify(ctx.request.body));
                if (code == "")
                    ctx.throw("Code required", 400);
                if (name == "")
                    ctx.throw("Name required", 400);
                const result = yield prisma.masterData.update({
                    where: {
                        id: +id,
                    },
                    data: {
                        master_data_id: master_data_id && +master_data_id,
                        code,
                        name,
                        description,
                        status: status,
                        parameter1_key,
                        parameter1_value,
                        parameter2_key,
                        parameter2_value,
                        parameter3_key,
                        parameter3_value,
                    },
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil membuat Master Data dengan nama " + name,
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
                const result = yield prisma.masterData.delete({
                    where: { id: +id },
                });
                ctx.status = 200;
                return (ctx.body = {
                    success: true,
                    message: "Berhasil menghapus Master Data",
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
exports.SettingMasterDataController = SettingMasterDataController;
