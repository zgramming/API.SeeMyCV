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
const fs_1 = require("fs");
const koa_router_1 = __importDefault(require("koa-router"));
const path_1 = require("path");
const process_1 = require("process");
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const constant_1 = require("../../utils/constant");
const function_1 = require("../../utils/function");
const prisma = new client_1.PrismaClient();
const validator = new fastest_validator_1.default();
const CVExperienceRouter = new koa_router_1.default({ prefix: "/api/cv/experience" });
const baseUrlImage = "images/cv/experience";
const directory = "/public/" + baseUrlImage;
const dirUpload = (0, process_1.cwd)() + directory;
CVExperienceRouter.get("/:users_id", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { users_id } = ctx.params;
    let res = yield prisma.cVExperience.findMany({
        include: { user: true },
        where: { users_id: +users_id },
    });
    res = res.map((val) => {
        if (val.image_company) {
            const imageUrl = `${ctx.origin}/${baseUrlImage}/${val.image_company}`;
            return Object.assign(Object.assign({}, val), { image_company: imageUrl });
        }
        return val;
    });
    return (ctx.body = {
        data: res,
        success: true,
    });
}));
CVExperienceRouter.post("/", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createDir = (0, fs_1.mkdirSync)(dirUpload, { recursive: true });
        const { id, users_id, company, job, start_date, end_date, description, is_graduated, tags, } = ctx.request.body;
        const exp = yield prisma.cVExperience.findFirst({
            where: { id: id !== null && id !== void 0 ? id : "" },
        });
        const data = {
            id: exp === null || exp === void 0 ? void 0 : exp.id,
            users_id: +users_id,
            company,
            job,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            description,
            is_graduated: +is_graduated ? true : false,
            tags,
            image_company: exp === null || exp === void 0 ? void 0 : exp.image_company,
        };
        console.log({
            body: data,
            file: ctx.request.files,
        });
        // ctx.throw(500, new Error("error"));
        const files = ctx.request.files;
        const schema = Object.assign(Object.assign({ id: { type: "string", optional: true }, users_id: { type: "number" }, company: { type: "string" }, job: { type: "string" }, start_date: { type: "date" } }, (end_date && { end_date: "date" })), { description: { type: "string" } });
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
        if (files === null || files === void 0 ? void 0 : files.image_company) {
            const file = files.image_company;
            const { size, mimetype, originalFilename, filepath } = file;
            const validateFile = (0, function_1.validationFile)({
                file: file,
                allowedMimetype: ["png", "jpeg", "jpg"],
                limitSizeMB: 1,
                onError(message) {
                    ctx.status = 400;
                    throw new Error(message);
                },
            });
            const { base: baseOri, name: nameOri, ext: extOri, } = (0, path_1.parse)(originalFilename);
            const filename = (exp === null || exp === void 0 ? void 0 : exp.image_company)
                ? exp.image_company
                : (0, uuid_1.v4)() + extOri;
            const { base: baseExpFile, name: nameExpFile, ext: extExpFile, } = (0, path_1.parse)(filename);
            const fullname = nameExpFile + extOri;
            /// Upload image
            (0, fs_1.renameSync)(file.filepath, `${dirUpload}/${fullname}`);
            /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
            /// Maka file yang lama akan dihapus
            if (extOri !== extExpFile && (exp === null || exp === void 0 ? void 0 : exp.image_company)) {
                (0, fs_1.unlinkSync)(dirUpload + "/" + exp.image_company);
            }
            /// Adding object into request body
            data.image_company = fullname;
        }
        if (!exp) {
            const create = yield prisma.cVExperience.create({
                include: { user: true },
                data: data,
            });
            ctx.body = 200;
            return (ctx.body = {
                success: true,
                message: "Berhasil menambah pengalaman baru",
                data: create,
            });
        }
        else {
            const update = yield prisma.cVExperience.update({
                include: { user: true },
                data: data,
                where: { id: exp.id },
            });
            ctx.body = 200;
            return (ctx.body = {
                success: true,
                message: "Berhasil mengupdate pengalaman baru",
                data: update,
            });
        }
    }
    catch (error) {
        console.log({ error: error });
        ctx.status = error.statusCode || error.status || 500;
        ctx.body = {
            success: false,
            message: error.message,
        };
    }
}));
CVExperienceRouter.del("/:id", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = ctx.params;
        const exp = yield prisma.cVExperience.findFirst({ where: { id } });
        if (!exp) {
            return ctx.throw(404, new Error("Pengalaman tidak ditemukan dengan id " + id));
        }
        const del = yield prisma.cVExperience.delete({ where: { id: exp === null || exp === void 0 ? void 0 : exp.id } });
        const pathImage = dirUpload + `/${del.image_company}`;
        if ((0, fs_1.existsSync)(pathImage))
            (0, fs_1.unlinkSync)(pathImage);
        ctx.status = 200;
        return (ctx.body = {
            message: `Pengalaman dengan id ${del.id} berhasil dihapus`,
            data: del,
        });
    }
    catch (error) {
        console.log({ error: error });
        ctx.status = error.statusCode || error.status || 500;
        ctx.body = {
            success: false,
            message: error.message,
        };
    }
}));
exports.default = CVExperienceRouter;
