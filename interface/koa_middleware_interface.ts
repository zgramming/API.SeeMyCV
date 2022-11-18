import { Next, ParameterizedContext } from "koa";
import Router from "koa-router";

export interface KoaMiddlewareInterface {
  ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>;
  next: Next;
}
