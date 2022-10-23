import Router from "koa-router";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ParameterRouter = new Router({ prefix: "/api/setting/parameter" });

ParameterRouter.get("/", async (ctx, next) => {
  const {
    code = "",
    name = "",
    value = "",
    status,
    limit,
    offset,
  }: {
    code?: string;
    name?: string;
    value?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = ctx.query;

  const result = await prisma.parameter.findMany({
    where: {
      ...(code && { code: { contains: code } }),
      ...(name && { name: { contains: name } }),
      ...(value && { value: { contains: value } }),
      ...(status && { status: status }),
    },
    ...(limit && { take: +limit }),
    ...(offset && { skip: +offset }),
  });

  return (ctx.body = { success: true, data: result });
});

ParameterRouter.post("/", async (ctx, next) => {
  try {
    const {
      code = "",
      name = "",
      value = "",
      status = "active",
    }: {
      code?: string;
      name?: string;
      value?: string;
      status?: string;
    } = JSON.parse(JSON.stringify(ctx.request.body));

    if (code == "") ctx.throw("Code required", 400);
    if (name == "") ctx.throw("Name required", 400);
    if (value == "") ctx.throw("Value required", 400);
    if (status == "") ctx.throw("Status required", 400);

    const result = await prisma.parameter.create({
      data: {
        code,
        name,
        value,
        status,
      },
    });

    return (ctx.body = {
      success: true,
      data: result,
      message: "Berhasil membuat Parameter dengan nama " + name,
    });
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

ParameterRouter.put("/", async (ctx, next) => {
  try {
    const { id = 0 }: { id?: number } = ctx.params;
    const {
      code = "",
      name = "",
      value = "",
      status = "active",
    }: {
      code?: string;
      name?: string;
      value?: string;
      status?: string;
    } = JSON.parse(JSON.stringify(ctx.request.body));

    if (code == "") ctx.throw("Code required", 400);
    if (name == "") ctx.throw("Name required", 400);
    if (value == "") ctx.throw("Value required", 400);
    if (status == "") ctx.throw("Status required", 400);

    const result = await prisma.parameter.update({
      where: { id: +id },
      data: {
        code,
        name,
        value,
        status,
      },
    });

    return (ctx.body = {
      success: true,
      data: result,
      message: "Berhasil membuat Parameter dengan nama " + name,
    });
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

ParameterRouter.del("/:id", async (ctx, next) => {
  try {
    const { id = 0 }: { id?: number } = ctx.params;
    if (id == 0) ctx.throw("ID is required", 400);
    const result = await prisma.parameter.delete({
      where: { id: +id },
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Berhasil menghapus Parameter",
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

export default ParameterRouter;
