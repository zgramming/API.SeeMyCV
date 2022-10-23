import Router from "koa-router";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const MasterCategoryRouter = new Router({
  prefix: "/api/setting/master_category",
});

MasterCategoryRouter.get("/", async (ctx, next) => {
  const {
    code = "",
    name = "",
    status,
    limit = 10,
    offset = 0,
  }: {
    code?: string;
    name?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = ctx.query;

  const result = await prisma.masterCategory.findMany({
    include: {
      master_datas: true,
      master_category_children: true,
      master_category_parent: true,
    },
    where: {
      ...(code && { code: { contains: code } }),
      ...(name && { name: { contains: name } }),
      ...(status && { status: status }),
    },
    // ...(limit !== 0 && { take: +limit }),
    // ...(offset !== 0 && { skip: +offset }),
  });

  return (ctx.body = { success: true, data: result });
});

MasterCategoryRouter.post("/", async (ctx, next) => {
  try {
    const {
      master_category_id = 0,
      code = "",
      name = "",
      description = "",
      status = "active",
    }: {
      master_category_id?: number;
      code?: string;
      name?: string;
      description?: string;
      status?: string;
    } = JSON.parse(JSON.stringify(ctx.request.body));

    if (code == "") ctx.throw("Code required", 400);
    if (name == "") ctx.throw("Name required", 400);

    const result = await prisma.masterCategory.create({
      data: {
        description: description,
        ...(master_category_id != 0 && {
          master_category_id: +master_category_id,
        }),
        status: status,
        code: code,
        name: name,
      },
    });

    return (ctx.body = {
      success: true,
      data: result,
      message: "Berhasil membuat Master Category dengan nama " + name,
    });
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

MasterCategoryRouter.put("/:id", async (ctx, next) => {
  try {
    const { id = 0 }: { id?: number } = ctx.params;
    const {
      master_category_id = 0,
      code = "",
      name = "",
      description = "",
      status = "active",
    }: {
      master_category_id?: number;
      code?: string;
      name?: string;
      description?: string;
      status?: string;
    } = JSON.parse(JSON.stringify(ctx.request.body));

    if (id == 0) ctx.throw("ID Required", 400);
    if (code == "") ctx.throw("Code required", 400);
    if (name == "") ctx.throw("Name required", 400);

    const result = await prisma.masterCategory.update({
      where: {
        id: +id,
      },
      data: {
        code: code,
        name: name,
        description: description,
        ...(master_category_id != 0 && {
          master_category_id: +master_category_id,
        }),
        status: status,
      },
    });

    return (ctx.body = {
      success: true,
      data: result,
      message: "Berhasil membuat Master Category dengan nama " + name,
    });
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

MasterCategoryRouter.del("/:id", async (ctx, next) => {
  try {
    const { id = 0 }: { id?: number } = ctx.params;
    if (id == 0) ctx.throw("ID is required", 400);
    const result = await prisma.masterCategory.delete({
      where: { id: +id },
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Berhasil menghapus Master Category",
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
export default MasterCategoryRouter;
