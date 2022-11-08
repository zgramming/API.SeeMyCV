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
exports.SettingParameterController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SettingParameterController {
    static get(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code = "", name = "", value = "", status, limit, offset, } = ctx.query;
            const result = yield prisma.parameter.findMany(Object.assign(Object.assign({ where: Object.assign(Object.assign(Object.assign(Object.assign({}, (code && { code: { contains: code } })), (name && { name: { contains: name } })), (value && { value: { contains: value } })), (status && { status: status })) }, (limit && { take: +limit })), (offset && { skip: +offset })));
            return (ctx.body = { success: true, data: result });
        });
    }
    static create(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code = "", name = "", value = "", status = "active", } = JSON.parse(JSON.stringify(ctx.request.body));
                if (code == "")
                    ctx.throw("Code required", 400);
                if (name == "")
                    ctx.throw("Name required", 400);
                if (value == "")
                    ctx.throw("Value required", 400);
                if (status == "")
                    ctx.throw("Status required", 400);
                const result = yield prisma.parameter.create({
                    data: {
                        code,
                        name,
                        value,
                        status,
                    },
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil membuat Parameter dengan nama " + name,
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
                const { code = "", name = "", value = "", status = "active", } = JSON.parse(JSON.stringify(ctx.request.body));
                if (code == "")
                    ctx.throw("Code required", 400);
                if (name == "")
                    ctx.throw("Name required", 400);
                if (value == "")
                    ctx.throw("Value required", 400);
                if (status == "")
                    ctx.throw("Status required", 400);
                const result = yield prisma.parameter.update({
                    where: { id: +id },
                    data: {
                        code,
                        name,
                        value,
                        status,
                    },
                });
                return (ctx.body = {
                    success: true,
                    data: result,
                    message: "Berhasil membuat Parameter dengan nama " + name,
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
                const result = yield prisma.parameter.delete({
                    where: { id: +id },
                });
                ctx.status = 200;
                return (ctx.body = {
                    success: true,
                    message: "Berhasil menghapus Parameter",
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
exports.SettingParameterController = SettingParameterController;
