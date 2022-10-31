import Router from "koa-router";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

const prisma = new PrismaClient();
const LoginRouter = new Router({ prefix: "/api/login" });

LoginRouter.post("/", async (ctx, next) => {
  try {
    const { username, password } = ctx.request.body;

    const user = await prisma.users.findFirst({
      where: {
        username,
      },
      include: {
        app_group_user: {
          include: {
            access_menu: {
              include: {
                app_menu: true,
              },
            },
          },
        },
      },
    });

    const checkPassword = await compare(password, user?.password ?? "");

    if (!user || !checkPassword) {
      ctx.throw(`Username ${username} atau password tidak valid`, 400);
    }

    const accessMenu = user!.app_group_user.access_menu;

    if (accessMenu.length == 0) {
      ctx.throw(
        `Username ${username} tidak mempunyai hak akses menu di aplikasi, silahkan hubungi admin`
      );
    }
    accessMenu.sort((a, b) => a.app_menu.order - b.app_menu.order);
    const firstRoute = accessMenu[0].app_menu.route;

    const resultUser = await prisma.users.findFirst({
      where: { username },
    });

    ctx.body = {
      success: true,
      message: "Success login",
      data: {
        route: firstRoute,
        user: resultUser,
      },
    };
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      success: false,
      message: error.message,
    };
  }
});

export default LoginRouter;
