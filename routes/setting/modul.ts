import Router from "koa-router";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ModulRouter = new Router({ prefix: "/api/setting/modul" });

ModulRouter.get("/", async (ctx, next) => {
  const {
    code = "",
    name = "",
    pattern = "",
    status,
    limit = 10,
    offset = 0,
  }: {
    code?: string;
    name?: string;
    pattern?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = ctx.query;

  const result = await prisma.appModul.findMany({
    where: {
      ...(code && { code: { contains: code } }),
      ...(name && { name: { contains: name } }),
      ...(pattern && { pattern: pattern }),
      ...(status && { status: status }),
    },
    include: {
      menus: true,
      access_menu: true,
      access_modul: true,
    },
    // ...(limit !== 0 && { take: +limit }),
    // ...(offset !== 0 && { skip: +offset }),
  });

  return (ctx.body = { success: true, data: result });
});

ModulRouter.post("/", async (ctx, next) => {
  try {
    const {
      code = "",
      name = "",
      pattern = "",
      icon = "",
      order = 0,
      status = "active",
    }: {
      code?: string;
      name?: string;
      pattern?: string;
      icon?: string;
      order?: number;
      status?: string;
    } = JSON.parse(JSON.stringify(ctx.request.body));

    if (code == "") ctx.throw("Code required", 400);
    if (name == "") ctx.throw("Name required", 400);
    if (pattern == "") ctx.throw("Pattern required", 400);
    if (status == "") ctx.throw("Status required", 400);

    const result = await prisma.appModul.create({
      data: {
        code,
        name,
        pattern,
        icon,
        order: +order,
        status,
      },
    });

    return (ctx.body = {
      success: true,
      data: result,
      message: "Berhasil membuat modul dengan nama " + name,
    });
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

ModulRouter.put("/:id", async (ctx, next) => {
  try {
    const { id = 0 }: { id?: number } = ctx.params;
    const {
      code = "",
      name = "",
      pattern = "",
      icon = "",
      order = 0,
      status = "active",
    }: {
      code?: string;
      name?: string;
      pattern?: string;
      icon?: string;
      order?: number;
      status?: string;
    } = JSON.parse(JSON.stringify(ctx.request.body));

    if (id == 0) ctx.throw("ID Required", 400);
    if (code == "") ctx.throw("Code required", 400);
    if (name == "") ctx.throw("Name required", 400);
    if (pattern == "") ctx.throw("Pattern required", 400);
    if (status == "") ctx.throw("Status required", 400);

    const result = await prisma.appModul.update({
      where: { id: +id },
      data: {
        code,
        name,
        pattern,
        icon,
        order: +order,
        status,
      },
    });

    return (ctx.body = {
      success: true,
      data: result,
      message: "Berhasil mengupdate modul dengan nama " + name,
    });
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

ModulRouter.del("/:id", async (ctx, next) => {
  try {
    const { id = 0 }: { id?: number } = ctx.params;
    if (id == 0) ctx.throw("ID is required", 400);
    const result = await prisma.appModul.delete({
      where: { id: +id },
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Berhasil menghapus modul",
      data: result,
    };
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

export default ModulRouter;
