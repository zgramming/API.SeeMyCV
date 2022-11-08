import { mkdirSync, readFileSync } from "fs";
import Router from "koa-router";
import { cwd } from "process";
import puppeteer from "puppeteer";

const V1TemplatePdfRouter = new Router({ prefix: "/api/v1/template_pdf" });
const dirUploadPDF = cwd() + "/public/template/pdf/output";

/// Reference :
/// [https://medium.com/@fmoessle/use-html-and-puppeteer-to-create-pdfs-in-node-js-566dbaf9d9ca]
/// [https://stackoverflow.com/questions/54563410/how-to-get-all-html-data-after-all-scripts-and-page-loading-is-done-puppeteer]
/// [https://gist.github.com/maykbrito/444645526ac25a413021b0cd4d70fe24]
V1TemplatePdfRouter.post("/", async (ctx, next) => {
  try {
    /// false = testing (you can see browser is open on your face) , true = production
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    /// Generate PDF Via File
    // const template = readFileSync(dirTemplate + "/template1.html", "utf-8");
    // await page.setContent(template, {
    //   waitUntil: "domcontentloaded",
    // });
    // const content = await page.content();
    // console.log({ content });

    const url = `https://seemycv.my.id/`;
    await page.goto(url, { waitUntil: "networkidle0" });

    mkdirSync(dirUploadPDF, { recursive: true });
    await page.pdf({
      format: "A4",
      printBackground: true,
      path: dirUploadPDF + "/testing.pdf",
    });
    await browser.close();

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: "",
    };
  } catch (error) {
    console.log({ errortemplatepdf: error });
  }
});

export default V1TemplatePdfRouter;
