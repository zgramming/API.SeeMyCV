import Router from "koa-router";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const V1UserRouter = new Router({ prefix: "/api/v1/user" });

const baseUrlFileProfile = "file/cv/profile";
const baseUrlFileLicenseCertificate = "file/cv/license_certificate";

const baseUrlImagesProfile = "images/cv/profile";
const baseUrlImagesExperience = "images/cv/experience";
const baseUrlImagesEducation = "images/cv/education";
const baseUrlImagesPortfolio = "images/cv/portfolio";

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
        CVProfile: true,
        CVPortfolio: true,
        CVLicenseCertificate: true,
        CVExperience: true,
        CVEducation: true,
      },
    });

    const profile =
      result.CVProfile.length === 0 ? undefined : result.CVProfile[0];

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

export default V1UserRouter;
