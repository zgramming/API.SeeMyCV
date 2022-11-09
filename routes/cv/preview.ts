import { mkdirSync } from "fs";
import { Next, ParameterizedContext } from "koa";
import { cwd } from "process";
import puppeteer from "puppeteer";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const dirUploadPDF = cwd() + "/public/template/pdf/output";

export class CVPreviewController {
  public static async getPdfPreview(ctx: ParameterizedContext, next: Next) {
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
}
