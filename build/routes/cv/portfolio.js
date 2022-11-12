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
exports.CVPortfolioController = void 0;
const fastest_validator_1 = __importDefault(require("fastest-validator"));
const fs_1 = require("fs");
const path_1 = require("path");
const process_1 = require("process");
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const constant_1 = require("../../utils/constant");
const function_1 = require("../../utils/function");
const validator = new fastest_validator_1.default();
const prisma = new client_1.PrismaClient();
const dirUpload = (0, process_1.cwd)() + "/public/images/cv/portfolio";
const baseUrlFile = "images/cv/portfolio";
class CVPortfolioController {
    static get(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { users_id } = ctx.params;
            let res = yield prisma.cVPortfolio.findMany({
                include: { user: true, urls: true },
                where: { users_id: +users_id },
            });
            res = res.map((val) => {
                const thumbnail = `${ctx.origin}/${baseUrlFile}/${val.thumbnail}`;
                return Object.assign(Object.assign({}, val), { thumbnail });
            });
            return (ctx.body = {
                data: res,
                success: true,
            });
        });
    }
    static getById(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = ctx.params;
            let res = yield prisma.cVPortfolio.findFirstOrThrow({
                where: { id: id !== null && id !== void 0 ? id : "" },
                include: {
                    urls: true,
                },
            });
            res.thumbnail = `${ctx.origin}/${baseUrlFile}/${res.thumbnail}`;
            ctx.status = 200;
            return (ctx.body = {
                success: true,
                data: res,
            });
        });
    }
    static upsert(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createDir = (0, fs_1.mkdirSync)(dirUpload, { recursive: true });
                const { id, users_id = 0, title, slug, description, tags, urls, } = ctx.request.body;
                const files = ctx.request.files;
                const portfolio = yield prisma.cVPortfolio.findFirst({
                    where: { id: id !== null && id !== void 0 ? id : "" },
                });
                const data = {
                    id: portfolio === null || portfolio === void 0 ? void 0 : portfolio.id,
                    users_id: +users_id,
                    title,
                    slug,
                    description,
                    tags,
                    thumbnail: portfolio === null || portfolio === void 0 ? void 0 : portfolio.thumbnail,
                };
                console.log({
                    body: ctx.request.body,
                    file: ctx.request.files,
                });
                const schema = {
                    id: { type: "string", optional: true },
                    users_id: { type: "number" },
                    title: { type: "string" },
                    slug: { type: "string" },
                    description: { type: "string" },
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
                if (files === null || files === void 0 ? void 0 : files.thumbnail) {
                    const file = files.thumbnail;
                    const { size, mimetype, originalFilename, filepath } = file;
                    const validateFile = (0, function_1.validationFile)({
                        file: file,
                        allowedMimetype: ["png", "jpg", "jpeg"],
                        limitSizeMB: 5,
                        onError(message) {
                            ctx.status = 400;
                            throw new Error(message);
                        },
                    });
                    const { base: baseOri, name: nameOri, ext: extOri, } = (0, path_1.parse)(originalFilename);
                    const filename = (portfolio === null || portfolio === void 0 ? void 0 : portfolio.thumbnail)
                        ? portfolio.thumbnail
                        : (0, uuid_1.v4)() + extOri;
                    const { base: basePortfolioFile, name: namePortfolioFile, ext: extPortfolioFile, } = (0, path_1.parse)(filename);
                    const fullname = namePortfolioFile + extOri;
                    /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
                    /// Maka file yang lama akan dihapus
                    if (extOri !== extPortfolioFile && (portfolio === null || portfolio === void 0 ? void 0 : portfolio.thumbnail)) {
                        (0, fs_1.unlink)(dirUpload + "/" + portfolio.thumbnail, (err) => {
                            if (err) {
                                console.log({ error_delete_image_portfolio: err });
                            }
                            console.log("success delete file portfolio");
                        });
                    }
                    /// Upload image
                    const fullPath = `${dirUpload}/${fullname}`;
                    (0, fs_1.renameSync)(file.filepath, fullPath);
                    const buffer = (0, fs_1.readFileSync)(fullPath);
                    (0, sharp_1.default)(buffer)
                        .resize(400)
                        .jpeg({ quality: 70 })
                        .png({ quality: 70 })
                        .toFile(fullPath);
                    /// Adding object into request body
                    data.thumbnail = fullname;
                }
                const parseUrls = urls
                    ? JSON.parse(urls)
                    : undefined;
                if (!portfolio) {
                    /// insert
                    const create = yield prisma.cVPortfolio.create({
                        include: { user: true, urls: true },
                        data: Object.assign(Object.assign({}, data), { urls: {
                                createMany: parseUrls && {
                                    data: parseUrls.map((val) => {
                                        return {
                                            name: val.nameurl,
                                            url: val.contenturl,
                                            users_id: +users_id,
                                        };
                                    }),
                                },
                            } }),
                    });
                    ctx.body = 200;
                    return (ctx.body = {
                        success: true,
                        message: "Berhasil menambah Portofolio",
                        data: create,
                    });
                }
                else {
                    /// update
                    const update = yield prisma.cVPortfolio.update({
                        include: { user: true, urls: true },
                        data: Object.assign(Object.assign({}, data), { urls: {
                                deleteMany: { users_id: +users_id },
                                createMany: parseUrls && {
                                    data: parseUrls.map((val) => {
                                        return {
                                            name: val.nameurl,
                                            url: val.contenturl,
                                            users_id: +users_id,
                                        };
                                    }),
                                },
                            } }),
                        where: { id: portfolio.id },
                    });
                    ctx.body = 200;
                    return (ctx.body = {
                        success: true,
                        message: "Berhasil mengupdate Portofolio",
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
        });
    }
    static delete(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const licenseCertificate = yield prisma.cVPortfolio.findFirst({
                    where: { id },
                });
                if (!licenseCertificate) {
                    return ctx.throw(404, new Error("Portofolio tidak ditemukan dengan id " + id));
                }
                const del = yield prisma.cVPortfolio.delete({
                    where: { id: licenseCertificate === null || licenseCertificate === void 0 ? void 0 : licenseCertificate.id },
                });
                const pathFile = dirUpload + `/${del.thumbnail}`;
                if ((0, fs_1.existsSync)(pathFile))
                    (0, fs_1.unlink)(pathFile, (err) => {
                        if (err) {
                            console.log({ error_delete_image_portfolio: err });
                        }
                        console.log("success delete file portfolio");
                    });
                ctx.status = 200;
                return (ctx.body = {
                    message: `Portofolio dengan id ${del.id} berhasil dihapus`,
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
        });
    }
}
exports.CVPortfolioController = CVPortfolioController;
