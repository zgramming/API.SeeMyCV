import Validator from "fastest-validator";
import Router from "koa-router";
import { v4 as uuidV4 } from "uuid";

import { PrismaClient } from "@prisma/client";

const validator = new Validator();
const prisma = new PrismaClient();
const CVPreviewRouter = new Router({ prefix: "/api/cv/preview" });

CVPreviewRouter.get("/pdf/:users_id", async (ctx, next) => {
  const { users_id } = ctx.params;
  const result = await prisma.users.findFirstOrThrow({
    where: {
      id: +users_id,
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

  ctx.status = 200;
  return (ctx.body = {
    message: "Berhasil mendapatkan data preview",
    data: result,
  });
});

export default CVPreviewRouter;
