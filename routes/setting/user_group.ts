import { Next, ParameterizedContext } from "koa";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SettingUserGroupController {
  public static async getUserGroup(ctx: ParameterizedContext, next: Next) {
    const {
      name,
      status,
      code,
      limit,
      offset,
    }: {
      code?: string;
      name?: string;
      status?: string;
      limit?: number;
      offset?: number;
    } = ctx.query;

    const userGroup = await prisma.appGroupUser.findMany({
      where: {
        ...(name && { name: name }),
        ...(status && { status: status }),
      },
      include: {
        user: true,
        access_menu: true,
        access_modul: true,
      },
      // ...(limit !== 0 && { take: +limit }),
      // ...(offset !== 0 && { skip: 10 }),
    });

    return (ctx.body = { success: true, data: userGroup });
  }

  public static async createUserGroup(ctx: ParameterizedContext, next: Next) {
    try {
      const {
        code,
        name,
        status,
      }: { code?: string; name?: string; status?: string } = JSON.parse(
        JSON.stringify(ctx.request.body)
      );

      if (code == "") ctx.throw("Code is required", 400);
      if (name == "") ctx.throw("Name is required", 400);
      if (status == "") ctx.throw("Status is required", 400);

      const result = await prisma.appGroupUser.create({
        data: {
          code: code ?? "",
          name: name ?? "",
          status: (status ?? "active") as string,
        },
      });

      return (ctx.body = {
        success: true,
        data: result,
        message: "Berhasil membuat user group",
      });
    } catch (error: any) {
      ctx.status = error.statusCode || error.status || 500;
      return (ctx.body = {
        success: false,
        message: error.message,
      });
    }
  }

  public static async updateUserGroup(ctx: ParameterizedContext, next: Next) {
    try {
      const { id = 0 }: { id?: number } = ctx.params;
      const {
        code,
        name,
        status,
      }: { id: string; code?: string; name?: string; status?: string } =
        JSON.parse(JSON.stringify(ctx.request.body));

      if (id == 0) ctx.throw("ID is required", 400);
      if (code == "") ctx.throw("Code is required", 400);
      if (name == "") ctx.throw("Name is required", 400);
      if (status == "") ctx.throw("Status is required", 400);

      const result = await prisma.appGroupUser.update({
        where: {
          id: +id ?? 0,
        },
        data: {
          code: code,
          name: name,
          status: (status ?? "active") as string,
        },
      });

      ctx.status = 200;
      return (ctx.body = {
        success: true,
        message: "Berhasil mengupdate nama menjadi " + name,
        data: result,
      });
    } catch (error: any) {
      ctx.status = error.statusCode || error.status || 500;
      return (ctx.body = {
        success: false,
        message: error.message,
      });
    }
  }

  public static async deleteUserGroup(ctx: ParameterizedContext, next: Next) {
    try {
      const { id = 0 }: { id?: number } = ctx.params;

      if (id == 0) ctx.throw("ID is required", 400);
      const result = await prisma.appGroupUser.delete({
        where: {
          id: +id,
        },
      });

      ctx.status = 200;
      return (ctx.body = {
        success: true,
        message: "Berhasil menghapus user group",
        data: result,
      });
    } catch (error: any) {
      ctx.status = error.statusCode || error.status || 500;
      return (ctx.body = {
        success: false,
        message: error.message,
        apasih: "gajelas",
      });
    }
  }
}
