import { hashSync } from "bcrypt";
import Router from "koa-router";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const UserRouter = new Router({ prefix: "/api/setting/user" });

const saltRounds = 10;

UserRouter.get("/", async (ctx, next) => {
  const {
    username,
    name,
    app_group_user_id = 0,
    status,
    limit = 10,
    offset = 0,
  }: {
    username?: string;
    name?: string;
    app_group_user_id?: number;
    status?: string;
    limit?: number;
    offset?: number;
  } = ctx.query;

  const users = await prisma.users.findMany({
    include: {
      app_group_user: true,
    },
    where: {
      ...(username && { username: { contains: username } }),
      ...(name && { name: { contains: name } }),
      ...(status && { status: status }),
      ...(app_group_user_id != 0 && { app_group_user_id: +app_group_user_id }),
    },
    // ...(limit !== 0 && { take: +limit }),
    // ...(offset !== 0 && { skip: +offset }),
  });
  return (ctx.body = { success: true, data: users });
});

UserRouter.post("/", async (ctx, next) => {
  try {
    const {
      app_group_user_id = 0,
      name = "",
      email = "",
      username = "",
      password = "",
      status = "active",
    }: {
      app_group_user_id?: number;
      name?: string;
      email?: string;
      username?: string;
      password?: string;
      status?: string;
    } = JSON.parse(JSON.stringify(ctx.request.body));

    if (app_group_user_id == 0) ctx.throw("Group User required", 400);
    if (name == "") ctx.throw("Nama required", 400);
    if (email == "") ctx.throw("Email required", 400);
    if (username == "") ctx.throw("Username required", 400);
    if (password == "") ctx.throw("Password required", 400);
    if (status == "") ctx.throw("Status required", 400);

    const result = await prisma.users.create({
      data: {
        email: email,
        name: name,
        password: hashSync(password, saltRounds),
        username: username,
        app_group_user_id: +app_group_user_id,
        status: status,
      },
    });

    return (ctx.body = {
      success: true,
      data: result,
      message: "Berhasil membuat user dengan nama " + name,
    });
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

UserRouter.put("/:id", async (ctx, next) => {
  try {
    const { id = 0 }: { id?: number } = ctx.params;
    const {
      app_group_user_id = 0,
      name = "",
      email = "",
      username = "",
      password = "",
      status = "active",
    }: {
      app_group_user_id?: number;
      name?: string;
      email?: string;
      username?: string;
      password?: string;
      status?: string;
    } = JSON.parse(JSON.stringify(ctx.request.body));

    if (id == 0) ctx.throw("ID Required", 400);
    if (app_group_user_id == 0) ctx.throw("Group User required", 400);
    if (name == "") ctx.throw("Nama required", 400);
    if (email == "") ctx.throw("Email required", 400);
    if (username == "") ctx.throw("Username required", 400);
    if (password == "") ctx.throw("Password required", 400);
    if (status == "") ctx.throw("Status required", 400);

    const result = await prisma.users.update({
      where: {
        id: +id,
      },
      data: {
        email: email,
        name: name,
        password: hashSync(password, saltRounds),
        username: username,
        app_group_user_id: +app_group_user_id,
        status: status,
      },
    });

    return (ctx.body = {
      success: true,
      data: result,
      message: "Berhasil mengupdate user dengan nama " + name,
    });
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

UserRouter.del("/:id", async (ctx, next) => {
  try {
    const { id = 0 }: { id?: number } = ctx.params;
    if (id == 0) ctx.throw("ID is required", 400);
    const result = await prisma.users.delete({
      where: { id: +id },
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Berhasil menghapus user",
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

export default UserRouter;
