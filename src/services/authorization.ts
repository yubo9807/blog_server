import { asyncto } from "@/utils/network";
import { Context } from "koa";
import { errorDealWith } from "./errorDealWith";
import { verifyJwt } from "./jwt";

/**
 * 获取当前用户名，密码，ID
 * @param ctx
 * @returns
 */
export async function getAuthorization(ctx: Context) {
  const { authorization } = ctx.headers;
  if (!authorization) errorDealWith(ctx, 401);  // 获取不到
  const [ error, data ] = await asyncto(verifyJwt(authorization));
  if (error) {
    error === 'jwt expired' ? errorDealWith(ctx, 403) : errorDealWith(ctx, 500, error);
  }
  return data;
}

/**
 * 当前用户是否具有权限
 * @param ctx
 * @param role 角色
 */
export async function powerDetection(ctx: Context, role: string = '') {
  const user = await getAuthorization(ctx);
  if (role && user && user.role !== role) errorDealWith(ctx, 405);
  return user;
}
