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
exports.CVProfileController = void 0;
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
const dirUploadImage = (0, process_1.cwd)() + "/public/images/cv/profile";
const dirUploadFile = (0, process_1.cwd)() + "/public/file/cv/profile";
const baseUrlImage = "images/cv/profile";
const baseUrlFile = "file/cv/profile";
class CVProfileController {
    static get(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { users_id } = ctx.params;
            const users = yield prisma.users.findFirst({
                where: { id: +users_id },
                include: {
                    CVProfile: true,
                },
            });
            console.log({ users });
            const result = users === null || users === void 0 ? void 0 : users.CVProfile;
            if (result === null || result === void 0 ? void 0 : result.image) {
                result.image = ctx.origin + "/" + baseUrlImage + "/" + result.image;
            }
            if (result === null || result === void 0 ? void 0 : result.banner_image) {
                result.banner_image =
                    ctx.origin + "/" + baseUrlImage + "/" + result.banner_image;
            }
            if (result === null || result === void 0 ? void 0 : result.latest_resume) {
                result.latest_resume =
                    ctx.origin + "/" + baseUrlFile + "/" + result.latest_resume;
            }
            return (ctx.body = {
                data: users,
                success: true,
            });
        });
    }
    static upsert(ctx, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, fs_1.mkdirSync)(dirUploadImage, { recursive: true });
                (0, fs_1.mkdirSync)(dirUploadFile, { recursive: true });
                const { users_id, motto, description, phone, web, twitter, facebook, instagram, linkedIn, github, address, } = ctx.request.body;
                const tempPathFile = [];
                const files = ctx.request.files;
                console.log({
                    files: files,
                    body: ctx.request.body,
                    header: ctx.headers,
                });
                const users = yield prisma.users.findFirstOrThrow({
                    where: { id: +users_id },
                    include: {
                        CVProfile: true,
                    },
                });
                const profile = users.CVProfile;
                const data = {
                    motto,
                    description,
                    phone: phone !== null && phone !== void 0 ? phone : null,
                    web: web !== null && web !== void 0 ? web : null,
                    twitter: twitter !== null && twitter !== void 0 ? twitter : null,
                    facebook: facebook !== null && facebook !== void 0 ? facebook : null,
                    instagram: instagram !== null && instagram !== void 0 ? instagram : null,
                    linkedIn: linkedIn !== null && linkedIn !== void 0 ? linkedIn : null,
                    github: github !== null && github !== void 0 ? github : null,
                    address: address !== null && address !== void 0 ? address : null,
                    users_id: users.id,
                    image: (_a = profile === null || profile === void 0 ? void 0 : profile.image) !== null && _a !== void 0 ? _a : null,
                    banner_image: (_b = profile === null || profile === void 0 ? void 0 : profile.banner_image) !== null && _b !== void 0 ? _b : null,
                    latest_resume: (_c = profile === null || profile === void 0 ? void 0 : profile.latest_resume) !== null && _c !== void 0 ? _c : null,
                };
                const schema = {
                    users_id: { type: "number" },
                    motto: { type: "string" },
                    description: { type: "string" },
                };
                const createSchema = validator.compile(schema);
                const check = yield createSchema({
                    users_id: users.id,
                    motto,
                    description,
                });
                if (check !== true) {
                    ctx.status = 400;
                    return (ctx.body = {
                        success: false,
                        type: constant_1.ERROR_TYPE_VALIDATION,
                        message: check,
                    });
                }
                if (files === null || files === void 0 ? void 0 : files.image) {
                    const file = files.image;
                    const { originalFilename } = file;
                    const validateFile = (0, function_1.validationFile)({
                        file: file,
                        allowedMimetype: ["png", "jpg", "jpeg"],
                        limitSizeMB: 0.5,
                        onError(message) {
                            ctx.status = 400;
                            throw new Error(message);
                        },
                    });
                    const { ext: extOri } = (0, path_1.parse)(originalFilename);
                    const filename = (profile === null || profile === void 0 ? void 0 : profile.image) ? profile.image : (0, uuid_1.v4)() + extOri;
                    const { name: nameProfileFile, ext: extProfileFile } = (0, path_1.parse)(filename);
                    const fullname = nameProfileFile + extOri;
                    /// Upload image
                    tempPathFile.push({
                        oldpath: file.filepath,
                        newPath: `${dirUploadImage}/${fullname}`,
                    });
                    /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
                    /// Maka file yang lama akan dihapus
                    if (extOri !== extProfileFile && (profile === null || profile === void 0 ? void 0 : profile.image)) {
                        (0, fs_1.unlinkSync)(dirUploadImage + "/" + profile.image);
                    }
                    /// Adding object into request body
                    data.image = fullname;
                }
                if (files === null || files === void 0 ? void 0 : files.banner_image) {
                    const file = files.banner_image;
                    const { originalFilename } = file;
                    const validateFile = (0, function_1.validationFile)({
                        file: file,
                        allowedMimetype: ["png", "jpg", "jpeg"],
                        limitSizeMB: 1,
                        onError(message) {
                            ctx.status = 400;
                            throw new Error(message);
                        },
                    });
                    const { ext: extOri } = (0, path_1.parse)(originalFilename);
                    const filename = (profile === null || profile === void 0 ? void 0 : profile.banner_image)
                        ? profile.banner_image
                        : (0, uuid_1.v4)() + extOri;
                    const { name: nameProfileFile, ext: extProfileFile } = (0, path_1.parse)(filename);
                    const fullname = nameProfileFile + extOri;
                    tempPathFile.push({
                        oldpath: file.filepath,
                        newPath: `${dirUploadImage}/${fullname}`,
                    });
                    /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
                    /// Maka file yang lama akan dihapus
                    if (extOri !== extProfileFile && (profile === null || profile === void 0 ? void 0 : profile.banner_image)) {
                        (0, fs_1.unlinkSync)(dirUploadImage + "/" + profile.banner_image);
                    }
                    /// Adding object into request body
                    data.banner_image = fullname;
                }
                if (files === null || files === void 0 ? void 0 : files.latest_resume) {
                    const file = files.latest_resume;
                    const { originalFilename } = file;
                    const validateFile = (0, function_1.validationFile)({
                        file: file,
                        allowedMimetype: ["pdf"],
                        limitSizeMB: 0.5,
                        onError(message) {
                            ctx.status = 400;
                            throw new Error(message);
                        },
                    });
                    const { ext: extOri } = (0, path_1.parse)(originalFilename);
                    const filename = (profile === null || profile === void 0 ? void 0 : profile.latest_resume)
                        ? profile.latest_resume
                        : (0, uuid_1.v4)() + extOri;
                    const { name: nameProfileFile, ext: extProfileFile } = (0, path_1.parse)(filename);
                    const fullname = nameProfileFile + extOri;
                    tempPathFile.push({
                        oldpath: file.filepath,
                        newPath: `${dirUploadFile}/${fullname}`,
                    });
                    /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
                    /// Maka file yang lama akan dihapus
                    if (extOri !== extProfileFile && (profile === null || profile === void 0 ? void 0 : profile.latest_resume)) {
                        (0, fs_1.unlinkSync)(dirUploadFile + "/" + profile.latest_resume);
                    }
                    /// Adding object into request body
                    data.latest_resume = fullname;
                }
                const upsert = yield prisma.cVProfile.upsert({
                    where: { users_id: users.id },
                    create: data,
                    update: data,
                });
                console.log({ tempPathFile });
                /// We assume all validation file already passed & Query SQL too, then we start upload all file
                tempPathFile.forEach((val, index) => {
                    (0, fs_1.renameSync)(val.oldpath, val.newPath);
                });
                return (ctx.body = {
                    success: true,
                    message: "Berhasil mengupdate user dengan nama " + users.name,
                    data: upsert,
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
exports.CVProfileController = CVProfileController;
