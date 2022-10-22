import Validator from "fastest-validator";
import koaBody from "koa-body";
import Router from "koa-router";

import { PrismaClient } from "@prisma/client";

import { ERROR_TYPE_VALIDATION } from "../../utils/constant";

const validator = new Validator();

const prisma = new PrismaClient();
const CVProfileRouter = new Router({ prefix: "/api/cv/profile" });

CVProfileRouter.get("/:users_id", async (ctx, next) => {
  const { users_id } = ctx.params;

  const result = await prisma.cVProfile.findFirst({
    include: { user: true },
    where: { users_id: +users_id },
  });

  return (ctx.body = {
    data: result,
    success: true,
  });
});

CVProfileRouter.post("/", koaBody({ multipart: true }), async (ctx, next) => {
  try {
    const files = ctx.request.files;
    const { users_id, name, motto, description, phone, email, web, address } =
      ctx.request.body;

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

    const data = { ...ctx.request.body, users_id: +users_id, image: undefined };

    const upsert = await prisma.cVProfile.upsert({
      where: { users_id: +users_id },
      create: data,
      update: data,
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
