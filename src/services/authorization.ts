import { Context } from "koa";
import { errorDealWith } from "./errorDealWith";
import { verifyJwt } from "./jwt";

/**
 * 获取当前用户名，密码，ID
 * @param ctx
 * @returns
 */
export function getAuthorization(ctx: Context) {
  const { authorization } = ctx.headers;
  if (!authorization) errorDealWith(ctx, 401);  // 获取不到
  return verifyJwt(authorization);
}

/**
 * 当前用户是否具有权限
 * @param ctx
 * @param role 角色
 */
export function powerDetection(ctx: Context, role: string = '') {
  const user = getAuthorization(ctx);
  if (role && user.role !== role) errorDealWith(ctx, 405);
  return user;
}
