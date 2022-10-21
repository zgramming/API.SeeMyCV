import Router from "koa-router";

import { PrismaClient } from "@prisma/client";
import Validator from "fastest-validator";
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

CVProfileRouter.post("/", async (ctx, next) => {
  try {
    const {
      users_id,
      name,
      motto,
      description,
      phone,
      email,
      web,
      address,
      image,
    } = ctx.request.body;

    console.log({ body: ctx.request.body });

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

    const result = await prisma.cVProfile.findFirst({
      where: { users_id: +users_id },
    });

    const data = { ...ctx.request.body, users_id: +users_id };

    const upsert = await prisma.cVProfile.upsert({
      where: { users_id: +users_id },
      create: data,
      update: data,
    });

    console.log(upsert);
    return (ctx.body = {
      success: true,
      data: result,
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
