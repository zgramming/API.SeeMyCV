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
const fastest_validator_1 = __importDefault(require("fastest-validator"));
const koa_router_1 = __importDefault(require("koa-router"));
const client_1 = require("@prisma/client");
const validator = new fastest_validator_1.default();
const prisma = new client_1.PrismaClient();
const CVPreviewRouter = new koa_router_1.default({ prefix: "/api/cv/preview" });
CVPreviewRouter.get("/pdf/:users_id", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { users_id } = ctx.params;
    const result = yield prisma.users.findFirstOrThrow({
        where: {
            id: +users_id,
        },
        include: {
            CVSkill: {
                include: { level: true },
                orderBy: {
                    level: {
                        order: "desc",
                    },
                },
            },
            CVExperience: {
                orderBy: {
                    start_date: "desc",
                },
            },
            CVEducation: {
                orderBy: {
                    start_date: "desc",
                },
            },
            CVLicenseCertificate: {
                orderBy: {
                    start_date: "desc",
                },
            },
            CVProfile: true,
            CVPortfolio: true,
        },
    });
    ctx.status = 200;
    return (ctx.body = {
        message: "Berhasil mendapatkan data preview",
        data: result,
    });
}));
exports.default = CVPreviewRouter;
