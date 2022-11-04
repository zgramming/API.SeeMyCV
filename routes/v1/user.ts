import { hashSync } from "bcrypt";
import Validator from "fastest-validator";
import Router from "koa-router";

import { PrismaClient } from "@prisma/client";

import { ERROR_TYPE_VALIDATION } from "../../utils/constant";

const prisma = new PrismaClient();
const V1UserRouter = new Router({ prefix: "/api/v1/user" });

const baseUrlFileProfile = "file/cv/profile";
const baseUrlFileLicenseCertificate = "file/cv/license_certificate";

const baseUrlImagesProfile = "images/cv/profile";
const baseUrlImagesExperience = "images/cv/experience";
const baseUrlImagesEducation = "images/cv/education";
const baseUrlImagesPortfolio = "images/cv/portfolio";
const validator = new Validator();

V1UserRouter.get("/:username", async (ctx, next) => {
  try {
    const { username } = ctx.params;
    const isExists = await prisma.users.count({
      where: {
        username: username,
      },
    });

    if (isExists <= 0) {
      ctx.status = 404;
      ctx.throw(404, new Error("User tidak ditemukan"));
    }

    const result = await prisma.users.findFirstOrThrow({
      where: {
        username: username,
      },
      include: {
        CVSkill: {
          include: { level: true },
          orderBy: {
            level: {
              order: "desc",
            },
          },
        },
        CVExperience: {
          orderBy: {
            start_date: "desc",
          },
        },
        CVEducation: {
          orderBy: {
            start_date: "desc",
          },
        },
        CVLicenseCertificate: {
          orderBy: {
            start_date: "desc",
          },
        },
        CVProfile: true,
        CVPortfolio: true,
      },
    });

    const profile = result.CVProfile;

    if (profile) {
      if (profile.image && profile.image !== "") {
        profile.image = `${ctx.origin}/${baseUrlImagesProfile}/${profile.image}`;
      }
      if (profile.banner_image && profile.banner_image !== "") {
        profile.banner_image = `${ctx.origin}/${baseUrlImagesProfile}/${profile.banner_image}`;
      }
      if (profile.latest_resume && profile.latest_resume !== "") {
        profile.latest_resume = `${ctx.origin}/${baseUrlFileProfile}/${profile.latest_resume}`;
      }
    }

    result.CVExperience = result.CVExperience.map((val) => {
      if (val.image_company && val.image_company !== "") {
        val.image_company = `${ctx.origin}/${baseUrlImagesExperience}/${val.image_company}`;
      }
      return { ...val };
    });

    result.CVEducation = result.CVEducation.map((val) => {
      if (val.image && val.image !== "") {
        val.image = `${ctx.origin}/${baseUrlImagesEducation}/${val.image}`;
      }
      return { ...val };
    });

    result.CVLicenseCertificate = result.CVLicenseCertificate.map((val) => {
      if (val.file && val.file !== "") {
        val.file = `${ctx.origin}/${baseUrlFileLicenseCertificate}/${val.file}`;
      }
      return { ...val };
    });

    result.CVPortfolio = result.CVPortfolio.map((val) => {
      if (val.thumbnail && val.thumbnail !== "") {
        val.thumbnail = `${ctx.origin}/${baseUrlImagesPortfolio}/${val.thumbnail}`;
      }
      return { ...val };
    });

    const data = {
      ...result,
      CVProfile: profile,
    };

    ctx.status = 200;
    ctx.body = {
      data: data,
      message: "Berhasil mendapatkan user dengan username " + username,
    };
  } catch (error: any) {
    console.log({ error: error });
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

V1UserRouter.post("/signup", async (ctx, next) => {
  try {
    const saltRounds = 10;
    const { username, password, email } = ctx.request.body;
    const data = {
      username,
      password,
      email,
      name: username,
    };
    const schema = {
      username: { type: "string", min: 8, alphadash: true },
      password: { type: "string", min: 8 },
      email: { type: "email" },
    };
    const createSchema = validator.compile(schema);
    const check = await createSchema({ ...data });
    if (check !== true) {
      ctx.status = 400;
      return (ctx.body = {
        success: false,
        type: ERROR_TYPE_VALIDATION,
        message: check,
      });
    }

    const groupUser = await prisma.appGroupUser.findFirstOrThrow({
      where: {
        code: "user",
      },
    });

    const create = await prisma.users.create({
      data: {
        ...data,
        status: "process_verification",
        password: hashSync(password, saltRounds),
        app_group_user_id: groupUser.id,
      },
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Berhasil membuat user dengan username " + username,
      data: create,
    };
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});
export default V1UserRouter;
