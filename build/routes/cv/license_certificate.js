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
exports.CVLicenseCertificateController = void 0;
const fastest_validator_1 = __importDefault(require("fastest-validator"));
const fs_1 = require("fs");
const path_1 = require("path");
const process_1 = require("process");
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const constant_1 = require("../../utils/constant");
const function_1 = require("../../utils/function");
const validator = new fastest_validator_1.default();
const prisma = new client_1.PrismaClient();
const dirUploadFile = (0, process_1.cwd)() + "/public/file/cv/license_certificate";
const baseUrlFile = "file/cv/license_certificate";
class CVLicenseCertificateController {
    static get(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { users_id } = ctx.params;
            let res = yield prisma.cVLicenseCertificate.findMany({
                include: { user: true },
                where: { users_id: +users_id },
            });
            res = res.map((val) => {
                const file = `${ctx.origin}/${baseUrlFile}/${val.file}`;
                return Object.assign(Object.assign({}, val), { file });
            });
            return (ctx.body = {
                data: res,
                success: true,
            });
        });
    }
    static upsert(ctx, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, fs_1.mkdirSync)(dirUploadFile, { recursive: true });
                const { id, users_id, name, publisher, start_date, end_date, is_expired, url, credential, } = ctx.request.body;
                const files = ctx.request.files;
                const licenseCertificate = yield prisma.cVLicenseCertificate.findFirst({
                    where: { id: id !== null && id !== void 0 ? id : "" },
                });
                const data = {
                    id: licenseCertificate === null || licenseCertificate === void 0 ? void 0 : licenseCertificate.id,
                    users_id: +users_id,
                    name,
                    publisher,
                    url: url !== null && url !== void 0 ? url : null,
                    credential: credential !== null && credential !== void 0 ? credential : null,
                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                    is_expired: +is_expired ? true : false,
                    file: (_a = licenseCertificate === null || licenseCertificate === void 0 ? void 0 : licenseCertificate.file) !== null && _a !== void 0 ? _a : null,
                };
                console.log({
                    body: ctx.request.body,
                    file: ctx.request.files,
                });
                const schema = Object.assign({ id: { type: "string", optional: true }, users_id: { type: "number" }, name: { type: "string" }, publisher: { type: "string" }, start_date: { type: "date" } }, (end_date && { end_date: "date" }));
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
                if (files === null || files === void 0 ? void 0 : files.file) {
                    const file = files.file;
                    const { size, mimetype, originalFilename, filepath } = file;
                    const validateFile = (0, function_1.validationFile)({
                        file: file,
                        allowedMimetype: ["png", "pdf"],
                        limitSizeMB: 1,
                        onError(message) {
                            ctx.status = 400;
                            throw new Error(message);
                        },
                    });
                    const { base: baseOri, name: nameOri, ext: extOri, } = (0, path_1.parse)(originalFilename);
                    const filename = (licenseCertificate === null || licenseCertificate === void 0 ? void 0 : licenseCertificate.file)
                        ? licenseCertificate.file
                        : (0, uuid_1.v4)() + extOri;
                    const { base: baseLicenseFile, name: nameLicenseFile, ext: extLicenseFile, } = (0, path_1.parse)(filename);
                    const fullname = nameLicenseFile + extOri;
                    /// Upload image
                    (0, fs_1.renameSync)(file.filepath, `${dirUploadFile}/${fullname}`);
                    /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
                    /// Maka file yang lama akan dihapus
                    if (extOri !== extLicenseFile && (licenseCertificate === null || licenseCertificate === void 0 ? void 0 : licenseCertificate.file)) {
                        (0, fs_1.unlinkSync)(dirUploadFile + "/" + licenseCertificate.file);
                    }
                    /// Adding object into request body
                    data.file = fullname;
                }
                if (!licenseCertificate) {
                    /// insert
                    const create = yield prisma.cVLicenseCertificate.create({
                        include: { user: true },
                        data: data,
                    });
                    ctx.body = 200;
                    return (ctx.body = {
                        success: true,
                        message: "Berhasil menambah Lisensi / Sertifikat baru",
                        data: create,
                    });
                }
                else {
                    /// update
                    const update = yield prisma.cVLicenseCertificate.update({
                        include: { user: true },
                        data: data,
                        where: { id: licenseCertificate.id },
                    });
                    ctx.body = 200;
                    return (ctx.body = {
                        success: true,
                        message: "Berhasil mengupdate Lisensi / Sertifikat baru",
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
                const licenseCertificate = yield prisma.cVLicenseCertificate.findFirst({
                    where: { id },
                });
                if (!licenseCertificate) {
                    return ctx.throw(404, new Error("Lisensi / Sertifikat tidak ditemukan dengan id " + id));
                }
                const del = yield prisma.cVLicenseCertificate.delete({
                    where: { id: licenseCertificate === null || licenseCertificate === void 0 ? void 0 : licenseCertificate.id },
                });
                if (del.file && del.file !== "") {
                    const pathFile = dirUploadFile + `/${del.file}`;
                    if ((0, fs_1.existsSync)(pathFile))
                        (0, fs_1.unlinkSync)(pathFile);
                }
                ctx.status = 200;
                return (ctx.body = {
                    message: `Lisensi / Sertifikat dengan id ${del.id} berhasil dihapus`,
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
exports.CVLicenseCertificateController = CVLicenseCertificateController;
