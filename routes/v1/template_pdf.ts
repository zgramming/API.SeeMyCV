import { mkdirSync } from "fs";
import Router from "koa-router";
import { cwd } from "process";
import puppeteer from "puppeteer";

import { PrismaClient } from "@prisma/client";

const V1TemplatePdfRouter = new Router({ prefix: "/api/v1/template_pdf" });
const dirUploadPDF = cwd() + "/public/template/pdf/output";
const prisma = new PrismaClient();

/// Reference :
/// [https://medium.com/@fmoessle/use-html-and-puppeteer-to-create-pdfs-in-node-js-566dbaf9d9ca]
/// [https://stackoverflow.com/questions/54563410/how-to-get-all-html-data-after-all-scripts-and-page-loading-is-done-puppeteer]
/// [https://gist.github.com/maykbrito/444645526ac25a413021b0cd4d70fe24]
V1TemplatePdfRouter.post("/:user_id", async (ctx, next) => {
  try {
    const { user_id } = ctx.params;

    const user = await prisma.users.findFirstOrThrow({
      where: { id: +(user_id ?? 0) },
    });

    /// false = testing (you can see browser is open on your face) , true = production
    const browser = await puppeteer.launch({
      headless: false,
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
    await page.pdf({
      format: "A4",

      margin: { bottom: 8, top: 8, left: 8, right: 8 },
      printBackground: true,
      path: `${dirUploadPDF}/${user.username}.pdf`,
    });

    await browser.close();

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Berhasil generate PDF",
      data: user,
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
});

export default V1TemplatePdfRouter;
