import Validator from "fastest-validator";
import { existsSync, mkdirSync, renameSync, unlinkSync } from "fs";
import Router from "koa-router";
import { cwd } from "process";
import { v4 as uuidV4 } from "uuid";

import { PrismaClient } from "@prisma/client";

import { ERROR_TYPE_VALIDATION } from "../../utils/constant";
import { mbTObytes } from "../../utils/function";

const validator = new Validator();
const prisma = new PrismaClient();
const CVEducationRouter = new Router({ prefix: "/api/cv/education" });

const dirUpload = cwd() + "/public/images/cv/education";
const baseUrlImage = "images/cv/education";

CVEducationRouter.get("/:users_id", async (ctx, next) => {
  const { users_id } = ctx.params;

  const res = await prisma.cVEducation.findMany({
    include: { user: true },
    where: { users_id: +users_id },
  });

  if (res.length == 0) ctx.throw(404, new Error("Pendidikan tidak ditemukan"));

  res.map((val) => {
    const image = `${ctx.origin}/${baseUrlImage}/${val.image}`;
    return { ...val, image };
  });

  return (ctx.body = {
    data: res,
    success: true,
  });
});

CVEducationRouter.post("/", async (ctx, next) => {
  const createDir = mkdirSync(dirUpload, { recursive: true });

  const {
    id,
    users_id,
    name,
    major,
    field_of_study,
    start_date,
    end_date,
    is_graduated,
  } = ctx.request.body;
  const files = ctx.request.files;
  const education = await prisma.cVEducation.findFirst({ where: { id } });
  const data = {
    id: education?.id,
    users_id: +users_id,
    name,
    major,
    field_of_study,
    start_date: new Date(start_date),
    end_date: new Date(end_date),
    is_graduated: +is_graduated ? true : false,
    image: education?.image,
  };

  console.log({
    body: data,
    file: ctx.request.files,
  });

  const schema = {
    id: { type: "string", optional: true },
    users_id: { type: "number" },
    name: { type: "string" },
    major: { type: "string" },
    field_of_study: { type: "string" },
    start_date: { type: "date" },
    ...(end_date && { end_date: "date" }),
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

  if (files?.image) {
    const image = files!.image as any;
    const size = image.size as number;
    if (size > mbTObytes(2)) ctx.throw(400, "Ukuran file maximal 2Mb");

    const ext = (image.originalFilename as string).split(".").pop();
    const filename = education?.image ?? uuidV4() + "." + ext;

    /// Upload image
    renameSync(image.filepath, `${dirUpload}/${filename}`);

    /// Adding object into request body
    data.image = filename;
  }

  if (!education) {
    /// insert
    const create = await prisma.cVEducation.create({
      include: { user: true },
      data: data,
    });
    ctx.body = 200;
    return (ctx.body = {
      success: true,
      message: "Berhasil menambah pendidikan baru",
      data: create,
    });
  } else {
    /// update
    const update = await prisma.cVEducation.update({
      include: { user: true },
      data: data,
      where: { id: education.id },
    });
    ctx.body = 200;
    return (ctx.body = {
      success: true,
      message: "Berhasil mengupdate pendidikan baru",
      data: update,
    });
  }
});

CVEducationRouter.del("/:id", async (ctx, next) => {
  try {
    const { id } = ctx.params;
    const exp = await prisma.cVEducation.findFirst({ where: { id } });
    if (!exp) {
      return ctx.throw(
        404,
        new Error("Pendidikan tidak ditemukan dengan id " + id)
      );
    }

    const del = await prisma.cVEducation.delete({ where: { id: exp?.id } });
    const pathImage = dirUpload + `/${del.image}`;
    if (existsSync(pathImage)) unlinkSync(pathImage);

    ctx.status = 200;
    return (ctx.body = {
      message: `Pendidikan dengan id ${del.id} berhasil dihapus`,
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

export default CVEducationRouter;
