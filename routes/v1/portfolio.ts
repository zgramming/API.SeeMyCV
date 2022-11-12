import { Next, ParameterizedContext } from "koa";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class V1PortfolioController {
  public static getByUsernameAndSlug = async (
    ctx: ParameterizedContext,
    next: Next
  ) => {
    try {
      const { username, slug } = ctx.params;
      const portfolio = await prisma.cVPortfolio.findFirstOrThrow({
        where: {
          slug: slug,
          user: {
            username: username,
          },
        },
        include: {
          urls: true,
        },
      });

      ctx.status = 200;
      return (ctx.body = {
        success: true,
        data: portfolio,
      });
    } catch (error: any) {
      console.log({ error });
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);

      ctx.status = error.statusCode || error.status || 500;
      return (ctx.body = {
        success: false,
        message: message,
      });
    }
  };
}
