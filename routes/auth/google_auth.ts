import { KoaMiddlewareInterface } from "../../interface/koa_middleware_interface";

export const isLoggedIn = async ({ ctx, next }: KoaMiddlewareInterface) => {
  if (!ctx.isAuthenticated()) {
    ctx.status = 401;
    return (ctx.body = {
      success: false,
      message: "Unauthorized",
    });
  }
  return await next();
};

export class GoogleAuth {
  public static async signin({ ctx, next }: KoaMiddlewareInterface) {}
}
