import Router from "koa-router";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DocumentationRouter = new Router({
  prefix: "/api/setting/documentation",
});

DocumentationRouter.get("/", async (ctx, next) => {
  const {
    code = "",
    name = "",
    job_id,
    status,
    limit = 10,
    offset = 0,
  }: {
    code?: string;
    name?: string;
    job_id?: number;
    status?: string;
    limit?: number;
    offset?: number;
  } = ctx.query;

  const result = await prisma.documentation.findMany({
    where: {
      ...(code && { code: { contains: code } }),
      ...(name && { name: { contains: name } }),
      ...(job_id && { job_id: job_id }),
      ...(status && { status: status }),
    },
    ...(limit !== 0 && { take: +limit }),
    ...(offset !== 0 && { skip: +offset }),
  });

  return (ctx.body = { success: true, data: result });
});

DocumentationRouter.post("/", async (ctx, next) => {
  try {
    const {
      code = "",
      name = "",
      job_id = 0,
      birth_date = "",
      money = 0,
      hobbies = [],
      description,
      status = "active",
    }: {
      code?: string;
      name?: string;
      job_id?: number;
      birth_date?: string;
      money?: number;
      hobbies?: string[];
      description?: string;
      status?: string;
    } = JSON.parse(JSON.stringify(ctx.request.body));

    if (job_id == 0) ctx.throw("Job required", 400);

    const result = await prisma.documentation.create({
      data: {
        name: name,
        code: code,
        job_id: +job_id,
        birth_date,
        money: +money,
        hobbies: hobbies,
        description,
        status,
      },
    });

    return (ctx.body = {
      success: true,
      data: result,
      message: "Berhasil membuat Dokumentasi dengan nama " + name,
    });
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

DocumentationRouter.put("/:id", async (ctx, next) => {
  try {
    const { id = 0 }: { id?: number } = ctx.params;
    const {
      code = "",
      name = "",
      job_id = 0,
      birth_date = "",
      money = 0,
      hobbies = [],
      description,
      status = "active",
    }: {
      code?: string;
      name?: string;
      job_id?: number;
      birth_date?: string;
      money?: number;
      hobbies?: string[];
      description?: string;
      status?: string;
    } = JSON.parse(JSON.stringify(ctx.request.body));

    if (job_id == 0) ctx.throw("Job required", 400);

    const result = await prisma.documentation.update({
      where: { id: +id },
      data: {
        name: name,
        code: code,
        job_id: +job_id,
        birth_date,
        money: +money,
        hobbies: hobbies,
        description,
        status,
      },
    });

    return (ctx.body = {
      success: true,
      data: result,
      message: "Berhasil membuat Dokumentasi dengan nama " + name,
    });
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

DocumentationRouter.del("/:id", async (ctx, next) => {
  try {
    const { id = 0 }: { id?: number } = ctx.params;
    if (id == 0) ctx.throw("ID is required", 400);
    const result = await prisma.documentation.delete({
      where: { id: +id },
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Berhasil menghapus Dokumentasi",
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

export default DocumentationRouter;
