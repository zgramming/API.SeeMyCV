import { PrismaClient } from "@prisma/client";
import Validator from "fastest-validator";
import Router from "koa-router";
import { ERROR_TYPE_VALIDATION } from "../../utils/constant";

const validator = new Validator();
const prisma = new PrismaClient({ log: [{ emit: "event", level: "query" }] });
const CVSkillRouter = new Router({ prefix: "/api/cv/skill" });

CVSkillRouter.get("/:users_id", async (ctx, next) => {
  const { users_id } = ctx.params;

  const res = await prisma.cVSkill.findMany({
    where: { users_id: +users_id },
    include: { user: true, level: true },
    orderBy: { level: { order: "asc" } },
  });
  if (res.length == 0) ctx.throw(404, new Error("Skill tidak ditemukan"));

  return (ctx.body = {
    data: res,
    success: true,
  });
});

CVSkillRouter.post("/", async (ctx, next) => {
  try {
    const { id, users_id, name, level_id } = ctx.request.body;
    const skill = await prisma.cVSkill.findFirst({ where: { id: id ?? "" } });
    const data = {
      id: skill?.id,
      users_id: +users_id,
      name,
      level_id: +level_id,
    };

    console.log({
      body: skill,
      file: ctx.request.files,
    });

    const schema = {
      id: { type: "string", optional: true },
      users_id: { type: "number" },
      name: { type: "string" },
      level_id: { type: "number" },
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

    if (!skill) {
      /// insert
      const create = await prisma.cVSkill.create({
        include: { user: true, level: true },
        data: data,
      });
      ctx.body = 200;
      return (ctx.body = {
        success: true,
        message: "Berhasil menambah skill baru",
        data: create,
      });
    } else {
      /// update
      const update = await prisma.cVSkill.update({
        include: { user: true, level: true },
        data: data,
        where: { id: skill.id },
      });
      ctx.body = 200;
      return (ctx.body = {
        success: true,
        message: "Berhasil mengupdate skill " + skill.name,
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

CVSkillRouter.del("/:id", async (ctx, next) => {
  try {
    const { id } = ctx.params;
    const skill = await prisma.cVSkill.findFirst({ where: { id } });
    if (!skill) {
      return ctx.throw(
        404,
        new Error("Pendidikan tidak ditemukan dengan id " + id)
      );
    }

    const del = await prisma.cVSkill.delete({ where: { id: skill.id } });

    ctx.status = 200;
    return (ctx.body = {
      message: `Skill ${skill.name} berhasil dihapus`,
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

export default CVSkillRouter;
