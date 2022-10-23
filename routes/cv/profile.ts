import Validator from 'fastest-validator';
import { mkdirSync, renameSync } from 'fs';
import Router from 'koa-router';
import { cwd } from 'process';
import { v4 as uuidV4 } from 'uuid';

import { PrismaClient } from '@prisma/client';

import { ERROR_TYPE_VALIDATION } from '../../utils/constant';
import { mbTObytes } from '../../utils/function';

const validator = new Validator();
const prisma = new PrismaClient();
const CVProfileRouter = new Router({ prefix: "/api/cv/profile" });

const dirUpload = cwd() + "/public/images/cv/profile";
const baseUrlImage = "images/cv/profile";

CVProfileRouter.get("/:users_id", async (ctx, next) => {
  const { users_id } = ctx.params;

  const result = await prisma.cVProfile.findFirst({
    include: { user: true },
    where: { users_id: +users_id },
  });

  if (result) {
    result.image = ctx.origin + "/" + baseUrlImage + "/" + result.image;
  }

  return (ctx.body = {
    data: result,
    success: true,
  });
});

CVProfileRouter.post("/", async (ctx, next) => {
  try {
    const createDir = mkdirSync(dirUpload, { recursive: true });

    const files = ctx.request.files;
    const { users_id, name, motto, description, phone, email, web, address } =
      ctx.request.body;

    console.log({ files: files });

    const profile = await prisma.cVProfile.findFirst({
      where: { users_id: +(users_id ?? "0") },
      include: {
        user: true,
      },
    });

    const data = {
      name,
      motto,
      description,
      phone,
      email,
      web,
      address,
      users_id: +users_id,
      image: profile?.image,
    };

    const schema = {
      users_id: { type: "number" },
      name: { type: "string" },
      motto: { type: "string" },
    };

    const createSchema = validator.compile(schema);
    const check = await createSchema({ users_id: +users_id, name, motto });
    if (check !== true) {
      ctx.status = 400;
      return (ctx.body = {
        success: false,
        type: ERROR_TYPE_VALIDATION,
        message: check,
      });
    }

    if (files?.image) {
      const image = files.image as any;
      const size = image.size as number;
      if (size > mbTObytes(2)) ctx.throw(400, "Ukuran file maximal 2Mb");

      const ext = (image.filepath as string).split(".").pop();
      const filename = profile?.image ?? uuidV4() + "." + ext;

      /// Upload image
      renameSync(image.filepath, dirUpload + `/${filename}`);

      /// Adding object into request body
      data.image = filename;
    }

    const upsert = await prisma.cVProfile.upsert({
      where: { users_id: +users_id },
      create: data,
      update: data,
    });

    upsert.image = ctx.origin + "/" + baseUrlImage + "/" + upsert.image;

    return (ctx.body = {
      success: true,
      message: "Berhasil mengupdate user dengan nama " + name,
      data: upsert,
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

export default CVProfileRouter;
