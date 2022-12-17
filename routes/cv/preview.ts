import Validator from "fastest-validator";
import { mkdirSync } from "fs";
import { Next, ParameterizedContext } from "koa";
import { cwd } from "process";
import puppeteer from "puppeteer";

import { PrismaClient } from "@prisma/client";
import { ERROR_TYPE_VALIDATION } from "../../utils/constant";

const prisma = new PrismaClient();
const validator = new Validator();
const dirUploadPDF = cwd() + "/public/template/pdf/output";

export class CVPreviewController {
  public static async getPreviewPDF(ctx: ParameterizedContext, next: Next) {
    try {
      const { user_id } = ctx.params;
      const result = await prisma.cVTemplatePDF.findFirst({
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
    } catch (error: any) {
      console.log({ error: error });
      ctx.status = error.code ?? 500;
      return (ctx.body = {
        success: false,
        message: error?.message ?? "Unknown Message Error",
      });
    }
  }

  public static async getPreviewWebsite(ctx: ParameterizedContext, next: Next) {
    try {
      const { user_id } = ctx.params;
      const result = await prisma.cVTemplateWebsite.findFirst({
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
    } catch (error: any) {
      console.log({ error: error });
      ctx.status = error.code ?? 500;
      return (ctx.body = {
        success: false,
        message: error?.message ?? "Unknown Message Error",
      });
    }
  }

  public static async getPreviewWebsiteByUsername(
    ctx: ParameterizedContext,
    next: Next
  ) {
    try {
      const { username } = ctx.params;
      const result = await prisma.cVTemplateWebsite.findFirst({
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
    } catch (error: any) {
      console.log({ error: error });
      ctx.status = error.code ?? 500;
      return (ctx.body = {
        success: false,
        message: error?.message ?? "Unknown Message Error",
      });
    }
  }

  public static async getDetailPreviewPDF(
    ctx: ParameterizedContext,
    next: Next
  ) {
    try {
      const { user_id } = ctx.params;
      const result = await prisma.users.findFirstOrThrow({
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
    } catch (error: any) {
      console.log({ error: error });
      ctx.status = error.code ?? 500;
      return (ctx.body = {
        success: false,
        message: error?.message ?? "Unknown Message Error",
        data: null,
      });
    }
  }

  public static async generatePDF(ctx: ParameterizedContext, next: Next) {
    try {
      const { user_id } = ctx.params;

      const user = await prisma.users.findFirstOrThrow({
        where: { id: +(user_id ?? 0) },
      });

      /// false = testing (you can see browser is open on your face) , true = production
      const browser = await puppeteer.launch({
        headless: true,
      });
      const page = await browser.newPage();

      /// Login first before generate PDF
      await page.goto(process.env.WEB_URL_LOGIN ?? "", {
        waitUntil: "networkidle0",
      });
      await page.type(
        `#form_validation_username`,
        process.env.DEFAULT_USERNAME_LOGIN ?? ""
      );
      await page.type(
        `#form_validation_password`,
        process.env.DEFAULT_PASSWORD_LOGIN ?? ""
      );
      await page.click("#form_validation_btn_submit");
      await page.waitForNavigation({ waitUntil: "networkidle0" });

      /// Generate PDF Via File
      // const template = readFileSync(dirTemplate + "/template1.html", "utf-8");
      // await page.setContent(template, {
      //   waitUntil: "domcontentloaded",
      // });
      // const content = await page.content();
      // console.log({ content });

      const url = (process.env.WEB_URL_PDF ?? "") + `/${user_id}`;
      console.log({ url });
      await page.goto(url, { waitUntil: "networkidle0" });

      mkdirSync(dirUploadPDF, { recursive: true });
      const filename = `${user.username}.pdf`;
      await page.pdf({
        format: "A4",

        margin: { bottom: 8, top: 8, left: 8, right: 8 },
        printBackground: true,
        path: `${dirUploadPDF}/${filename}`,
      });

      await browser.close();

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
    } catch (error: any) {
      console.log({ errortemplatepdf: error });
      console.log({ error: error });
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  public static async saveWebsite(ctx: ParameterizedContext, next: Next) {
    try {
      const { user_id, template_website_id } = ctx.request.body;
      const user = await prisma.users.findFirstOrThrow({
        where: { id: +user_id },
      });

      const schema = {
        user_id: { type: "number" },
        template_website_id: { type: "number", optional: true },
      };

      const createSchema = validator.compile(schema);
      const check = await createSchema({
        user_id: user.id,
        template_website_id,
      });

      if (check !== true) {
        ctx.status = 400;
        return (ctx.body = {
          success: false,
          type: ERROR_TYPE_VALIDATION,
          message: check,
        });
      }

      const data = {
        users_id: +user_id,
        template_website_id: template_website_id ? template_website_id : null,
      };

      const upsert = await prisma.cVTemplateWebsite.upsert({
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
    } catch (error: any) {
      console.log({ error: error });
      ctx.status = error.code ?? 500;
      return (ctx.body = {
        success: false,
        message: error?.message ?? "Unknown Message Error",
      });
    }
  }

  public static async savePDF(ctx: ParameterizedContext, next: Next) {
    try {
      const { id, user_id, template_pdf_id } = ctx.request.body;
      const user = await prisma.users.findFirstOrThrow({
        where: { id: +user_id },
      });

      const schema = {
        user_id: { type: "number" },
        template_website_id: { type: "number", optional: true },
      };

      const createSchema = validator.compile(schema);
      const check = await createSchema({
        user_id: user.id,
        template_pdf_id,
      });

      if (check !== true) {
        ctx.status = 400;
        return (ctx.body = {
          success: false,
          type: ERROR_TYPE_VALIDATION,
          message: check,
        });
      }

      const data = {
        users_id: +user_id,
        template_pdf_id,
      };

      const upsert = await prisma.cVTemplatePDF.upsert({
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
    } catch (error: any) {
      console.log({ error: error });
      ctx.status = error.code ?? 500;
      return (ctx.body = {
        success: false,
        message: error?.message ?? "Unknown Message Error",
      });
    }
  }
}
