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
const CVLicenseCertificateRouter = new Router({
  prefix: "/api/cv/license_certificate",
});

const dirUpload = cwd() + "/public/images/cv/license_certificate";
const baseUrlFile = "images/cv/license_certificate";

CVLicenseCertificateRouter.get("/:users_id", async (ctx, next) => {
  const { users_id } = ctx.params;

  let res = await prisma.cVLicenseCertificate.findMany({
    include: { user: true },
    where: { users_id: +users_id },
  });

  res = res.map((val) => {
    const file = `${ctx.origin}/${baseUrlFile}/${val.file}`;
    return { ...val, file };
  });

  return (ctx.body = {
    data: res,
    success: true,
  });
});

CVLicenseCertificateRouter.post("/", async (ctx, next) => {
  try {
    const createDir = mkdirSync(dirUpload, { recursive: true });

    const {
      id,
      users_id,
      name,
      publisher,
      start_date,
      end_date,
      is_expired,
      url,
      credential,
    } = ctx.request.body;
    const files = ctx.request.files;

    const licenseCertificate = !id
      ? null
      : await prisma.cVLicenseCertificate.findFirst({
          where: { id: id },
        });

    const data = {
      id: licenseCertificate?.id,
      users_id: +users_id,
      name,
      publisher,
      url,
      credential,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      is_expired: +is_expired ? true : false,
      file: licenseCertificate?.file,
    };

    console.log({
      body: ctx.request.body,
      file: ctx.request.files,
    });

    const schema = {
      id: { type: "string", optional: true },
      users_id: { type: "number" },
      name: { type: "string" },
      publisher: { type: "string" },
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

    if (files?.file) {
      const file = files!.file as any;
      const { size, mimetype, originalFilename, filepath } = file;
      const validateFile = validationFile({
        file: file,
        allowedMimetype: ["png", "pdf"],
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

      const filename = licenseCertificate?.file
        ? licenseCertificate.file
        : uuidV4() + extOri;

      const {
        base: baseLicenseFile,
        name: nameLicenseFile,
        ext: extLicenseFile,
      } = parse(filename);

      const fullname = nameLicenseFile + extOri;

      /// Upload image
      renameSync(file.filepath, `${dirUpload}/${fullname}`);

      /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
      /// Maka file yang lama akan dihapus
      if (extOri !== extLicenseFile && licenseCertificate?.file) {
        unlinkSync(dirUpload + "/" + licenseCertificate.file);
      }

      /// Adding object into request body
      data.file = fullname;
    }

    if (!licenseCertificate) {
      /// insert
      const create = await prisma.cVLicenseCertificate.create({
        include: { user: true },
        data: data,
      });
      ctx.body = 200;
      return (ctx.body = {
        success: true,
        message: "Berhasil menambah Lisensi / Sertifikat baru",
        data: create,
      });
    } else {
      /// update
      const update = await prisma.cVLicenseCertificate.update({
        include: { user: true },
        data: data,
        where: { id: licenseCertificate.id },
      });
      ctx.body = 200;
      return (ctx.body = {
        success: true,
        message: "Berhasil mengupdate Lisensi / Sertifikat baru",
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

CVLicenseCertificateRouter.del("/:id", async (ctx, next) => {
  try {
    const { id } = ctx.params;
    const licenseCertificate = await prisma.cVLicenseCertificate.findFirst({
      where: { id },
    });
    if (!licenseCertificate) {
      return ctx.throw(
        404,
        new Error("Lisensi / Sertifikat tidak ditemukan dengan id " + id)
      );
    }

    const del = await prisma.cVLicenseCertificate.delete({
      where: { id: licenseCertificate?.id },
    });

    const pathFile = dirUpload + `/${del.file}`;
    if (existsSync(pathFile)) unlinkSync(pathFile);

    ctx.status = 200;
    return (ctx.body = {
      message: `Lisensi / Sertifikat dengan id ${del.id} berhasil dihapus`,
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

export default CVLicenseCertificateRouter;