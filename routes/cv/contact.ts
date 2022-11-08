import Validator from "fastest-validator";
import { Next, ParameterizedContext } from "koa";

import { PrismaClient } from "@prisma/client";

import { ERROR_TYPE_VALIDATION } from "../../utils/constant";

const prisma = new PrismaClient();
const validator = new Validator();

export class CVContactController {
  public static async get(ctx: ParameterizedContext, next: Next) {
    const { users_id } = ctx.params;
    const result = await prisma.cVContact.findMany({
      include: { user: true },
      where: { users_id: +users_id },
    });

    ctx.status = 200;
    return (ctx.body = {
      success: true,
      data: result,
    });
  }

  public static async send(ctx: ParameterizedContext, next: Next) {
    try {
      const { username } = ctx.params;
      const { email_sender, subject_sender, content_sender } = ctx.request.body;
      const user = await prisma.users.findFirstOrThrow({
        where: { username: username },
      });

      const data = {
        users_id: user.id,
        email_sender,
        subject_sender,
        content_sender,
      };

      console.log({
        body: data,
        file: ctx.request.files,
      });

      const schema = {
        email_sender: { type: "string" },
        subject_sender: { type: "string" },
        content_sender: { type: "string" },
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

      const insert = await prisma.cVContact.create({
        data: data,
      });

      ctx.status = 200;
      return (ctx.body = {
        success: true,
        message: "Berhasil mengirimkan pesan",
        data: insert,
      });
    } catch (error: any) {
      console.log({ error: error });
      ctx.status = error.statusCode || error.status || 500;
      return (ctx.body = {
        success: false,
        message: error.message,
      });
    }
  }
}
