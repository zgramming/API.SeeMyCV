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
exports.CVSkillController = void 0;
const fastest_validator_1 = __importDefault(require("fastest-validator"));
const client_1 = require("@prisma/client");
const constant_1 = require("../../utils/constant");
const validator = new fastest_validator_1.default();
const prisma = new client_1.PrismaClient({ log: [{ emit: "event", level: "query" }] });
class CVSkillController {
    static get(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { users_id } = ctx.params;
            const res = yield prisma.cVSkill.findMany({
                where: { users_id: +users_id },
                include: { user: true, level: true },
                orderBy: { level: { order: "asc" } },
            });
            if (res.length == 0)
                ctx.throw(404, new Error("Skill tidak ditemukan"));
            return (ctx.body = {
                data: res,
                success: true,
            });
        });
    }
    static upsert(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, users_id, name, level_id } = ctx.request.body;
                const skill = yield prisma.cVSkill.findFirst({ where: { id: id !== null && id !== void 0 ? id : "" } });
                const data = {
                    id: skill === null || skill === void 0 ? void 0 : skill.id,
                    users_id: +users_id,
                    name,
                    level_id: +level_id,
                };
                console.log({
                    body: skill,
                    file: ctx.request.files,
                });
                const schema = {
                    id: { type: "string", optional: true },
                    users_id: { type: "number" },
                    name: { type: "string" },
                    level_id: { type: "number" },
                };
                const createSchema = validator.compile(schema);
                const checkSchema = yield createSchema(data);
                if (checkSchema !== true) {
                    ctx.status = 400;
                    return (ctx.body = {
                        success: false,
                        type: constant_1.ERROR_TYPE_VALIDATION,
                        message: checkSchema,
                    });
                }
                if (!skill) {
                    /// insert
                    const create = yield prisma.cVSkill.create({
                        include: { user: true, level: true },
                        data: data,
                    });
                    ctx.body = 200;
                    return (ctx.body = {
                        success: true,
                        message: "Berhasil menambah skill baru",
                        data: create,
                    });
                }
                else {
                    /// update
                    const update = yield prisma.cVSkill.update({
                        include: { user: true, level: true },
                        data: data,
                        where: { id: skill.id },
                    });
                    ctx.body = 200;
                    return (ctx.body = {
                        success: true,
                        message: "Berhasil mengupdate skill " + skill.name,
                        data: update,
                    });
                }
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
    static delete(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const skill = yield prisma.cVSkill.findFirst({ where: { id } });
                if (!skill) {
                    return ctx.throw(404, new Error("Pendidikan tidak ditemukan dengan id " + id));
                }
                const del = yield prisma.cVSkill.delete({ where: { id: skill.id } });
                ctx.status = 200;
                return (ctx.body = {
                    message: `Skill ${skill.name} berhasil dihapus`,
                    data: del,
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
}
exports.CVSkillController = CVSkillController;
