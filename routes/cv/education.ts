import Validator from "fastest-validator";
import { existsSync, mkdirSync, readFileSync, renameSync, unlink } from "fs";
import { Next, ParameterizedContext } from "koa";
import { parse } from "path";
import { cwd } from "process";
import sharp from "sharp";
import { v4 as uuidV4 } from "uuid";

import { PrismaClient } from "@prisma/client";

import { ERROR_TYPE_VALIDATION } from "../../utils/constant";
import { validationFile } from "../../utils/function";

const validator = new Validator();
const prisma = new PrismaClient();

const dirUpload = cwd() + "/public/images/cv/education";
const baseUrlImage = "images/cv/education";
export class CVEducationController {
  public static async get(ctx: ParameterizedContext, next: Next) {
    const { users_id } = ctx.params;

    let res = await prisma.cVEducation.findMany({
      include: { user: true },
      where: { users_id: +users_id },
    });

    res = res.map((val) => {
      const image = `${ctx.origin}/${baseUrlImage}/${val.image}`;
      return { ...val, image };
    });

    return (ctx.body = {
      data: res,
      success: true,
    });
  }

  public static async upsert(ctx: ParameterizedContext, next: Next) {
    try {
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
      const education = await prisma.cVEducation.findFirst({
        where: { id: id ?? "" },
      });

      const data = {
        id: education?.id,
        users_id: +users_id,
        name,
        major,
        field_of_study,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        is_graduated: +is_graduated ? true : false,
        image: education?.image ?? null,
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
        const file = files!.image as any;
        const { size, mimetype, originalFilename, filepath } = file;
        const validateFile = validationFile({
          file: file,
          allowedMimetype: ["png", "jpeg", "jpg"],
          limitSizeMB: 5,
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

        const filename = education?.image ? education.image : uuidV4() + extOri;

        const {
          base: baseEducationFile,
          name: nameEducationFile,
          ext: extEducationFile,
        } = parse(filename);

        const fullname = nameEducationFile + extOri;

        /// Jika file yang diupload extensionnya berbeda dengan file yang sudah ada
        /// Maka file yang lama akan dihapus
        if (extOri !== extEducationFile && education?.image) {
          unlink(dirUpload + "/" + education.image, (err) => {
            if (err) {
              console.log({ error_delete_image_education: err });
            }
            console.log("success delete iamge education");
          });
        }

        /// Upload image
        const fullPath = `${dirUpload}/${fullname}`;
        renameSync(file.filepath, fullPath);

        const buffer = readFileSync(fullPath);
        sharp(buffer)
          .resize(300)
          .jpeg({ quality: 70 })
          .png({ quality: 70 })
          .toFile(fullPath);

        /// Adding object into request body
        data.image = fullname;
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
    } catch (error: any) {
      console.log({ error: error });
      ctx.status = error.statusCode || error.status || 500;
      return (ctx.body = {
        success: false,
        message: error.message,
      });
    }
  }

  public static async delete(ctx: ParameterizedContext, next: Next) {
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
      if (existsSync(pathImage))
        unlink(pathImage, (err) => {
          if (err) {
            console.log({ error_delete_image_education: err });
          }
          console.log("success delete iamge education");
        });

      ctx.status = 200;
      return (ctx.body = {
        message: `Pendidikan dengan id ${del.id} berhasil dihapus`,
        data: del,
      });
    } catch (error: any) {
      console.log({ error: error });
      ctx.status = error.statusCode || error.status || 500;
      return (ctx.body = {
        success: false,
        message: error.message,
      });
    }
  }
}
