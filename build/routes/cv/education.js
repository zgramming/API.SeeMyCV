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
const validator = new fastest_validator_1.default();
const prisma = new client_1.PrismaClient();
const CVEducationRouter = new koa_router_1.default({ prefix: "/api/cv/education" });
const dirUpload = (0, process_1.cwd)() + "/public/images/cv/education";
const baseUrlImage = "images/cv/education";
CVEducationRouter.get("/:users_id", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { users_id } = ctx.params;
    let res = yield prisma.cVEducation.findMany({
        include: { user: true },
        where: { users_id: +users_id },
    });
    if (res.length == 0)
        ctx.throw(404, new Error("Pendidikan tidak ditemukan"));
    res = res.map((val) => {
        const image = `${ctx.origin}/${baseUrlImage}/${val.image}`;
        return Object.assign(Object.assign({}, val), { image });
    });
    return (ctx.body = {
        data: res,
        success: true,
    });
}));
CVEducationRouter.post("/", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createDir = (0, fs_1.mkdirSync)(dirUpload, { recursive: true });
        const { id, users_id, name, major, field_of_study, start_date, end_date, is_graduated, } = ctx.request.body;
        const files = ctx.request.files;
        const education = yield prisma.cVEducation.findFirst({
            where: { id: id !== null && id !== void 0 ? id : "" },
        });
        const data = {
            id: education === null || education === void 0 ? void 0 : education.id,
            users_id: +users_id,
            name,
            major,
            field_of_study,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            is_graduated: +is_graduated ? true : false,
            image: education === null || education === void 0 ? void 0 : education.image,
        };
        console.log({
            body: data,
            file: ctx.request.files,
        });
        const schema = Object.assign({ id: { type: "string", optional: true }, users_id: { type: "number" }, name: { type: "string" }, major: { type: "string" }, field_of_study: { type: "string" }, start_date: { type: "date" } }, (end_date && { end_date: "date" }));
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
        if (files === null || files === void 0 ? void 0 : files.image) {
            const file = files.image;
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
            const filename = (education === null || education === void 0 ? void 0 : education.image) ? education.image : (0, uuid_1.v4)() + extOri;
            const { base: baseEducationFile, name: nameEducationFile, ext: extEducationFile, } = (0, path_1.parse)(filename);
            const fullname = nameEducationFile + extOri;
            /// Upload image
            (0, fs_1.renameSync)(file.filepath, `${dirUpload}/${fullname}`);
            /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
            /// Maka file yang lama akan dihapus
            if (extOri !== extEducationFile && (education === null || education === void 0 ? void 0 : education.image)) {
                (0, fs_1.unlinkSync)(dirUpload + "/" + education.image);
            }
            /// Adding object into request body
            data.image = fullname;
        }
        if (!education) {
            /// insert
            const create = yield prisma.cVEducation.create({
                include: { user: true },
                data: data,
            });
            ctx.body = 200;
            return (ctx.body = {
                success: true,
                message: "Berhasil menambah pendidikan baru",
                data: create,
            });
        }
        else {
            /// update
            const update = yield prisma.cVEducation.update({
                include: { user: true },
                data: data,
                where: { id: education.id },
            });
            ctx.body = 200;
            return (ctx.body = {
                success: true,
                message: "Berhasil mengupdate pendidikan baru",
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
CVEducationRouter.del("/:id", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = ctx.params;
        const exp = yield prisma.cVEducation.findFirst({ where: { id } });
        if (!exp) {
            return ctx.throw(404, new Error("Pendidikan tidak ditemukan dengan id " + id));
        }
        const del = yield prisma.cVEducation.delete({ where: { id: exp === null || exp === void 0 ? void 0 : exp.id } });
        const pathImage = dirUpload + `/${del.image}`;
        if ((0, fs_1.existsSync)(pathImage))
            (0, fs_1.unlinkSync)(pathImage);
        ctx.status = 200;
        return (ctx.body = {
            message: `Pendidikan dengan id ${del.id} berhasil dihapus`,
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
exports.default = CVEducationRouter;
