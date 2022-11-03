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

const dirUploadImage = cwd() + "/public/images/cv/profile";
const dirUploadFile = cwd() + "/public/file/cv/profile";
const baseUrlImage = "images/cv/profile";
const baseUrlFile = "file/cv/profile";

CVProfileRouter.get("/:users_id", async (ctx, next) => {
  const { users_id } = ctx.params;

  
  const users = await prisma.users.findFirst({
    where: { id: +users_id },
    include: {
      CVProfile: true,
    },
  });
  console.log({ users });
  const result = users?.CVProfile;

  if (result?.image) {
    result.image = ctx.origin + "/" + baseUrlImage + "/" + result.image;
  }
  if (result?.banner_image) {
    result.banner_image =
      ctx.origin + "/" + baseUrlImage + "/" + result.banner_image;
  }
  if (result?.latest_resume) {
    result.latest_resume =
      ctx.origin + "/" + baseUrlFile + "/" + result.latest_resume;
  }

  return (ctx.body = {
    data: users,
    success: true,
  });
});

CVProfileRouter.post("/", async (ctx, next) => {
  try {
    mkdirSync(dirUploadImage, { recursive: true });
    mkdirSync(dirUploadFile, { recursive: true });

    const {
      users_id,
      motto,
      description,
      phone,
      web,
      twitter,
      facebook,
      instagram,
      linkedIn,
      github,
      address,
    } = ctx.request.body;
    const tempPathFile: Array<{
      oldpath: string;
      newPath: string;
    }> = [];
    const files = ctx.request.files;

    console.log({ files: files, body: ctx.request.body, header: ctx.headers });
    const users = await prisma.users.findFirstOrThrow({
      where: { id: +users_id },
      include: {
        CVProfile: true,
      },
    });

    const profile = users.CVProfile;

    const data = {
      motto,
      description,
      phone,
      web,
      twitter,
      facebook,
      instagram,
      linkedIn,
      github,
      address,
      users_id: users.id,
      image: profile?.image,
      banner_image: profile?.banner_image,
      latest_resume: profile?.latest_resume,
    };

    const schema = {
      users_id: { type: "number" },
      motto: { type: "string" },
      description: { type: "string" },
    };

    const createSchema = validator.compile(schema);
    const check = await createSchema({
      users_id: users.id,
      name,
      motto,
    });
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
        limitSizeMB: 0.5,
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
      tempPathFile.push({
        oldpath: file.filepath,
        newPath: `${dirUploadImage}/${fullname}`,
      });

      /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
      /// Maka file yang lama akan dihapus
      if (extOri !== extProfileFile && profile?.image) {
        unlinkSync(dirUploadImage + "/" + profile.image);
      }

      /// Adding object into request body
      data.image = fullname;
    }

    if (files?.banner_image) {
      const file = files!.banner_image as any;
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
      const filename = profile?.banner_image
        ? profile.banner_image
        : uuidV4() + extOri;

      const { name: nameProfileFile, ext: extProfileFile } = parse(filename);
      const fullname = nameProfileFile + extOri;

      tempPathFile.push({
        oldpath: file.filepath,
        newPath: `${dirUploadImage}/${fullname}`,
      });
      /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
      /// Maka file yang lama akan dihapus
      if (extOri !== extProfileFile && profile?.banner_image) {
        unlinkSync(dirUploadImage + "/" + profile.banner_image);
      }

      /// Adding object into request body
      data.banner_image = fullname;
    }

    if (files?.latest_resume) {
      const file = files!.latest_resume as any;
      const { originalFilename } = file;
      const validateFile = validationFile({
        file: file,
        allowedMimetype: ["pdf"],
        limitSizeMB: 0.5,
        onError(message) {
          ctx.status = 400;
          throw new Error(message);
        },
      });

      const { ext: extOri } = parse(originalFilename);
      const filename = profile?.latest_resume
        ? profile.latest_resume
        : uuidV4() + extOri;

      const { name: nameProfileFile, ext: extProfileFile } = parse(filename);
      const fullname = nameProfileFile + extOri;

      tempPathFile.push({
        oldpath: file.filepath,
        newPath: `${dirUploadFile}/${fullname}`,
      });

      /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
      /// Maka file yang lama akan dihapus
      if (extOri !== extProfileFile && profile?.latest_resume) {
        unlinkSync(dirUploadFile + "/" + profile.latest_resume);
      }

      /// Adding object into request body
      data.latest_resume = fullname;
    }

    const upsert = await prisma.cVProfile.upsert({
      where: { users_id: users.id },
      create: data,
      update: data,
    });

    console.log({ tempPathFile });

    /// We assume all validation file already passed & Query SQL too, then we start upload all file
    tempPathFile.forEach((val, index) => {
      renameSync(val.oldpath, val.newPath);
    });

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
