import Validator from "fastest-validator";
import { mkdirSync, renameSync, unlinkSync } from "fs";
import Router from "koa-router";
import { parse } from "path";
import { cwd } from "process";
import { v4 as uuidV4 } from "uuid";

import { PrismaClient } from "@prisma/client";

import { ERROR_TYPE_VALIDATION } from "../../utils/constant";
import { validationFile } from "../../utils/function";

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

    const { users_id, name, motto, description, phone, email, web, address } =
      ctx.request.body;
    const files = ctx.request.files;

    console.log({ files: files, body: ctx.request.body, header: ctx.headers });
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
      const file = files!.image as any;
      const { originalFilename } = file;
      const validateFile = validationFile({
        file: file,
        allowedMimetype: ["png", "jpg", "jpeg"],
        limitSizeMB: 1,
        onError(message) {
          ctx.status = 400;
          throw new Error(message);
        },
      });

      const { ext: extOri } = parse(originalFilename);
      const filename = profile?.image ? profile.image : uuidV4() + extOri;

      const { name: nameProfileFile, ext: extProfileFile } = parse(filename);
      const fullname = nameProfileFile + extOri;

      /// Upload image
      renameSync(file.filepath, `${dirUpload}/${fullname}`);

      /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
      /// Maka file yang lama akan dihapus
      if (extOri !== extProfileFile && profile?.image) {
        unlinkSync(dirUpload + "/" + profile.image);
      }

      /// Adding object into request body
      data.image = fullname;
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
