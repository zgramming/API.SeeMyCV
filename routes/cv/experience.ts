import Validator from "fastest-validator";
import { existsSync, mkdirSync, renameSync, unlinkSync } from "fs";
import Router from "koa-router";
import { parse } from "path";
import { cwd } from "process";
import { v4 as uuidV4 } from "uuid";

import { PrismaClient } from "@prisma/client";

import { ERROR_TYPE_VALIDATION } from "../../utils/constant";
import { validationFile } from "../../utils/function";

const prisma = new PrismaClient();
const validator = new Validator();

const CVExperienceRouter = new Router({ prefix: "/api/cv/experience" });

const baseUrlImage = "images/cv/experience";
const directory = "/public/" + baseUrlImage;
const dirUpload = cwd() + directory;

CVExperienceRouter.get("/:users_id", async (ctx, next) => {
  const { users_id } = ctx.params;

  let res = await prisma.cVExperience.findMany({
    include: { user: true },
    where: { users_id: +users_id },
  });

  res = res.map((val) => {
    if (val.image_company) {
      const imageUrl = `${ctx.origin}/${baseUrlImage}/${val.image_company}`;
      return { ...val, image_company: imageUrl };
    }
    return val;
  });

  return (ctx.body = {
    data: res,
    success: true,
  });
});

CVExperienceRouter.post("/", async (ctx, next) => {
  try {
    const createDir = mkdirSync(dirUpload, { recursive: true });

    const {
      id,
      users_id,
      company,
      job,
      start_date,
      end_date,
      description,
      is_graduated,
      tags,
    } = ctx.request.body;

    const exp = await prisma.cVExperience.findFirst({
      where: { id: id ?? "" },
    });

    const data = {
      id: exp?.id,
      users_id: +users_id,
      company,
      job,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      description,
      is_graduated: +is_graduated ? true : false,
      tags,
      image_company: exp?.image_company,
    };

    console.log({
      body: data,
      file: ctx.request.files,
    });
    // ctx.throw(500, new Error("error"));

    const files = ctx.request.files;

    const schema = {
      id: { type: "string", optional: true },
      users_id: { type: "number" },
      company: { type: "string" },
      job: { type: "string" },
      start_date: { type: "date" },
      ...(end_date && { end_date: "date" }),
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
    if (files?.image_company) {
      const file = files!.image_company as any;
      const { size, mimetype, originalFilename, filepath } = file;
      const validateFile = validationFile({
        file: file,
        allowedMimetype: ["png", "jpeg", "jpg"],
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

      const filename = exp?.image_company
        ? exp.image_company
        : uuidV4() + extOri;

      const {
        base: baseExpFile,
        name: nameExpFile,
        ext: extExpFile,
      } = parse(filename);

      const fullname = nameExpFile + extOri;

      /// Upload image
      renameSync(file.filepath, `${dirUpload}/${fullname}`);

      /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
      /// Maka file yang lama akan dihapus
      if (extOri !== extExpFile && exp?.image_company) {
        unlinkSync(dirUpload + "/" + exp.image_company);
      }

      /// Adding object into request body
      data.image_company = fullname;
    }

    if (!exp) {
      const create = await prisma.cVExperience.create({
        include: { user: true },
        data: data,
      });
      ctx.body = 200;
      return (ctx.body = {
        success: true,
        message: "Berhasil menambah pengalaman baru",
        data: create,
      });
    } else {
      const update = await prisma.cVExperience.update({
        include: { user: true },
        data: data,
        where: { id: exp.id },
      });
      ctx.body = 200;
      return (ctx.body = {
        success: true,
        message: "Berhasil mengupdate pengalaman baru",
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

CVExperienceRouter.del("/:id", async (ctx, next) => {
  try {
    const { id } = ctx.params;
    const exp = await prisma.cVExperience.findFirst({ where: { id } });
    if (!exp) {
      return ctx.throw(
        404,
        new Error("Pengalaman tidak ditemukan dengan id " + id)
      );
    }

    const del = await prisma.cVExperience.delete({ where: { id: exp?.id } });
    const pathImage = dirUpload + `/${del.image_company}`;
    if (existsSync(pathImage)) unlinkSync(pathImage);

    ctx.status = 200;
    return (ctx.body = {
      message: `Pengalaman dengan id ${del.id} berhasil dihapus`,
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

export default CVExperienceRouter;
