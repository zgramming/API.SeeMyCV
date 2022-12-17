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
exports.CVPreviewController = void 0;
const fastest_validator_1 = __importDefault(require("fastest-validator"));
const fs_1 = require("fs");
const process_1 = require("process");
const puppeteer_1 = __importDefault(require("puppeteer"));
const client_1 = require("@prisma/client");
const constant_1 = require("../../utils/constant");
const prisma = new client_1.PrismaClient();
const validator = new fastest_validator_1.default();
const dirUploadPDF = (0, process_1.cwd)() + "/public/template/pdf/output";
class CVPreviewController {
    static getPreviewPDF(ctx, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = ctx.params;
                const result = yield prisma.cVTemplatePDF.findFirst({
                    where: {
                        users_id: +user_id,
                    },
                    include: {
                        template_pdf: true,
                    },
                });
                ctx.status = 200;
                return (ctx.body = {
                    success: true,
                    data: result,
                });
            }
            catch (error) {
                console.log({ error: error });
                ctx.status = (_a = error.code) !== null && _a !== void 0 ? _a : 500;
                return (ctx.body = {
                    success: false,
                    message: (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Unknown Message Error",
                });
            }
        });
    }
    static getPreviewWebsite(ctx, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = ctx.params;
                const result = yield prisma.cVTemplateWebsite.findFirst({
                    where: {
                        users_id: +user_id,
                    },
                    include: {
                        template_website: true,
                    },
                });
                ctx.status = 200;
                return (ctx.body = {
                    success: true,
                    data: result,
                });
            }
            catch (error) {
                console.log({ error: error });
                ctx.status = (_a = error.code) !== null && _a !== void 0 ? _a : 500;
                return (ctx.body = {
                    success: false,
                    message: (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Unknown Message Error",
                });
            }
        });
    }
    static getPreviewWebsiteByUsername(ctx, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = ctx.params;
                const result = yield prisma.cVTemplateWebsite.findFirst({
                    where: {
                        user: {
                            username: username,
                        },
                    },
                    include: {
                        template_website: true,
                    },
                });
                ctx.status = 200;
                return (ctx.body = {
                    success: true,
                    data: result,
                });
            }
            catch (error) {
                console.log({ error: error });
                ctx.status = (_a = error.code) !== null && _a !== void 0 ? _a : 500;
                return (ctx.body = {
                    success: false,
                    message: (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Unknown Message Error",
                });
            }
        });
    }
    static getDetailPreviewPDF(ctx, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = ctx.params;
                const result = yield prisma.users.findFirstOrThrow({
                    where: {
                        id: +user_id,
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
            }
            catch (error) {
                console.log({ error: error });
                ctx.status = (_a = error.code) !== null && _a !== void 0 ? _a : 500;
                return (ctx.body = {
                    success: false,
                    message: (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Unknown Message Error",
                    data: null,
                });
            }
        });
    }
    static generatePDF(ctx, next) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = ctx.params;
                const user = yield prisma.users.findFirstOrThrow({
                    where: { id: +(user_id !== null && user_id !== void 0 ? user_id : 0) },
                });
                /// false = testing (you can see browser is open on your face) , true = production
                const browser = yield puppeteer_1.default.launch({
                    headless: true,
                });
                const page = yield browser.newPage();
                /// Login first before generate PDF
                yield page.goto((_a = process.env.WEB_URL_LOGIN) !== null && _a !== void 0 ? _a : "", {
                    waitUntil: "networkidle0",
                });
                yield page.type(`#form_validation_username`, (_b = process.env.DEFAULT_USERNAME_LOGIN) !== null && _b !== void 0 ? _b : "");
                yield page.type(`#form_validation_password`, (_c = process.env.DEFAULT_PASSWORD_LOGIN) !== null && _c !== void 0 ? _c : "");
                yield page.click("#form_validation_btn_submit");
                yield page.waitForNavigation({ waitUntil: "networkidle0" });
                /// Generate PDF Via File
                // const template = readFileSync(dirTemplate + "/template1.html", "utf-8");
                // await page.setContent(template, {
                //   waitUntil: "domcontentloaded",
                // });
                // const content = await page.content();
                // console.log({ content });
                const url = ((_d = process.env.WEB_URL_PDF) !== null && _d !== void 0 ? _d : "") + `/${user_id}`;
                console.log({ url });
                yield page.goto(url, { waitUntil: "networkidle0" });
                (0, fs_1.mkdirSync)(dirUploadPDF, { recursive: true });
                const filename = `${user.username}.pdf`;
                yield page.pdf({
                    format: "A4",
                    margin: { bottom: 8, top: 8, left: 8, right: 8 },
                    printBackground: true,
                    path: `${dirUploadPDF}/${filename}`,
                });
                yield browser.close();
                const baseDir = `template/pdf/output`;
                const urlDownload = `${ctx.origin}/${baseDir}/${filename}`;
                ctx.status = 200;
                ctx.body = {
                    success: true,
                    message: "Berhasil generate PDF",
                    data: {
                        url_download: urlDownload,
                        filename: filename,
                    },
                };
            }
            catch (error) {
                console.log({ errortemplatepdf: error });
                console.log({ error: error });
                ctx.status = error.statusCode || error.status || 500;
                ctx.body = {
                    success: false,
                    message: error.message,
                };
            }
        });
    }
    static saveWebsite(ctx, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, template_website_id } = ctx.request.body;
                const user = yield prisma.users.findFirstOrThrow({
                    where: { id: +user_id },
                });
                const schema = {
                    user_id: { type: "number" },
                    template_website_id: { type: "number", optional: true },
                };
                const createSchema = validator.compile(schema);
                const check = yield createSchema({
                    user_id: user.id,
                    template_website_id,
                });
                if (check !== true) {
                    ctx.status = 400;
                    return (ctx.body = {
                        success: false,
                        type: constant_1.ERROR_TYPE_VALIDATION,
                        message: check,
                    });
                }
                const data = {
                    users_id: +user_id,
                    template_website_id: template_website_id ? template_website_id : null,
                };
                const upsert = yield prisma.cVTemplateWebsite.upsert({
                    where: {
                        users_id: user.id,
                    },
                    create: data,
                    update: data,
                });
                ctx.status = 200;
                return (ctx.body = {
                    message: "Berhasil mengupdate template Website",
                    data: upsert,
                });
            }
            catch (error) {
                console.log({ error: error });
                ctx.status = (_a = error.code) !== null && _a !== void 0 ? _a : 500;
                return (ctx.body = {
                    success: false,
                    message: (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Unknown Message Error",
                });
            }
        });
    }
    static savePDF(ctx, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, user_id, template_pdf_id } = ctx.request.body;
                const user = yield prisma.users.findFirstOrThrow({
                    where: { id: +user_id },
                });
                const schema = {
                    user_id: { type: "number" },
                    template_website_id: { type: "number", optional: true },
                };
                const createSchema = validator.compile(schema);
                const check = yield createSchema({
                    user_id: user.id,
                    template_pdf_id,
                });
                if (check !== true) {
                    ctx.status = 400;
                    return (ctx.body = {
                        success: false,
                        type: constant_1.ERROR_TYPE_VALIDATION,
                        message: check,
                    });
                }
                const data = {
                    users_id: +user_id,
                    template_pdf_id,
                };
                const upsert = yield prisma.cVTemplatePDF.upsert({
                    where: {
                        users_id: user.id,
                    },
                    create: data,
                    update: data,
                });
                ctx.status = 200;
                return (ctx.body = {
                    message: "Berhasil mengupdate template PDF",
                    data: upsert,
                });
            }
            catch (error) {
                console.log({ error: error });
                ctx.status = (_a = error.code) !== null && _a !== void 0 ? _a : 500;
                return (ctx.body = {
                    success: false,
                    message: (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Unknown Message Error",
                });
            }
        });
    }
}
exports.CVPreviewController = CVPreviewController;
