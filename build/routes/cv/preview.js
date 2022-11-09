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
const fs_1 = require("fs");
const process_1 = require("process");
const puppeteer_1 = __importDefault(require("puppeteer"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dirUploadPDF = (0, process_1.cwd)() + "/public/template/pdf/output";
class CVPreviewController {
    static getPdfPreview(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
}
exports.CVPreviewController = CVPreviewController;
