import Validator from "fastest-validator";
import { existsSync, mkdirSync, renameSync, unlinkSync } from "fs";
import Router from "koa-router";
import { parse } from "path";
import { cwd } from "process";
import { v4 as uuidV4 } from "uuid";

import { PrismaClient } from "@prisma/client";

import { ERROR_TYPE_VALIDATION } from "../../utils/constant";
import { validationFile } from "../../utils/function";

const validator = new Validator();
const prisma = new PrismaClient();
const CVPortfolioRouter = new Router({
  prefix: "/api/cv/portfolio",
});

const dirUpload = cwd() + "/public/images/cv/portfolio";
const baseUrlFile = "images/cv/portfolio";

CVPortfolioRouter.get("/:users_id", async (ctx, next) => {
  const { users_id } = ctx.params;

  let res = await prisma.cVPortfolio.findMany({
    include: { user: true, urls: true },
    where: { users_id: +users_id },
  });

  res = res.map((val) => {
    const thumbnail = `${ctx.origin}/${baseUrlFile}/${val.thumbnail}`;
    return { ...val, thumbnail };
  });

  return (ctx.body = {
    data: res,
    success: true,
  });
});

CVPortfolioRouter.post("/", async (ctx, next) => {
  try {
    const createDir = mkdirSync(dirUpload, { recursive: true });
    const {
      id,
      users_id = 0,
      title,
      slug,
      description,
      tags,
      urls,
    }: {
      id?: string;
      users_id?: number;
      title: string;
      slug: string;
      description: string;
      tags?: Array<string>;
      urls?: string;
    } = ctx.request.body;
    const files = ctx.request.files;
    const portfolio = await prisma.cVPortfolio.findFirst({
      where: { id: id ?? "-1" },
    });

    const data = {
      id: portfolio?.id,
      users_id: +users_id,
      title,
      slug,
      description,
      tags,
      thumbnail: portfolio?.thumbnail,
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
    const checkSchema = await createSchema(data);

    if (checkSchema !== true) {
      ctx.status = 400;
      return (ctx.body = {
        success: false,
        type: ERROR_TYPE_VALIDATION,
        message: checkSchema,
      });
    }

    if (files?.thumbnail) {
      const file = files!.thumbnail as any;
      const { size, mimetype, originalFilename, filepath } = file;
      const validateFile = validationFile({
        file: file,
        allowedMimetype: ["png", "jpg", "jpeg"],
        limitSizeMB: 1,
        onError(message) {
          ctx.status = 400;
          throw new Error(message);
        },
      });

      const {
        base: baseOri,
        name: nameOri,
        ext: extOri,
      } = parse(originalFilename);

      const filename = portfolio?.thumbnail
        ? portfolio.thumbnail
        : uuidV4() + extOri;

      const {
        base: basePortfolioFile,
        name: namePortfolioFile,
        ext: extPortfolioFile,
      } = parse(filename);

      const fullname = namePortfolioFile + extOri;

      /// Upload image
      renameSync(file.filepath, `${dirUpload}/${fullname}`);

      /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
      /// Maka file yang lama akan dihapus
      if (extOri !== extPortfolioFile && portfolio?.thumbnail) {
        unlinkSync(dirUpload + "/" + portfolio.thumbnail);
      }

      /// Adding object into request body
      data.thumbnail = fullname;
    }

    const parseUrls = urls
      ? (JSON.parse(urls) as Array<{ nameurl: string; contenturl: string }>)
      : undefined;

    if (!portfolio) {
      /// insert
      const create = await prisma.cVPortfolio.create({
        include: { user: true, urls: true },
        data: {
          ...data,
          urls: {
            createMany: parseUrls && {
              data: parseUrls.map((val) => {
                return {
                  name: val.nameurl,
                  url: val.contenturl,
                  users_id: +users_id,
                };
              }),
            },
          },
        },
      });
      ctx.body = 200;
      return (ctx.body = {
        success: true,
        message: "Berhasil menambah Portofolio",
        data: create,
      });
    } else {
      /// update
      const update = await prisma.cVPortfolio.update({
        include: { user: true, urls: true },
        data: {
          ...data,
          urls: {
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
          },
        },
        where: { id: portfolio.id },
      });
      ctx.body = 200;
      return (ctx.body = {
        success: true,
        message: "Berhasil mengupdate Portofolio",
        data: update,
      });
    }
  } catch (error: any) {
    console.log({ error: error });
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

CVPortfolioRouter.del("/:id", async (ctx, next) => {
  try {
    const { id } = ctx.params;
    const licenseCertificate = await prisma.cVPortfolio.findFirst({
      where: { id },
    });
    if (!licenseCertificate) {
      return ctx.throw(
        404,
        new Error("Portofolio tidak ditemukan dengan id " + id)
      );
    }

    const del = await prisma.cVPortfolio.delete({
      where: { id: licenseCertificate?.id },
    });

    const pathFile = dirUpload + `/${del.thumbnail}`;
    if (existsSync(pathFile)) unlinkSync(pathFile);

    ctx.status = 200;
    return (ctx.body = {
      message: `Portofolio dengan id ${del.id} berhasil dihapus`,
      data: del,
    });
  } catch (error: any) {
    console.log({ error: error });
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

export default CVPortfolioRouter;
