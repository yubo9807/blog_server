import { asyncto } from "@/utils/network";
import { Context } from "koa";
import { throwError } from "./errorDealWith";
import { verifyJwt } from "./jwt";

/**
 * 获取当前用户名，密码，ID
 * @param ctx
 * @returns
 */
export async function getAuthorization(ctx: Context, report = true) {
  const { authorization } = ctx.headers;
  if (report && !authorization) throwError(ctx, 401);  // 获取不到
  const [ error, data ] = await asyncto(verifyJwt(authorization));
  if (report && error) {
    throwError(ctx, 403);
  }
  return data;
}

/**
 * 当前用户是否具有权限
 * @param ctx
 * @param role 角色
 */
export async function powerDetection(ctx: Context, roles: string[]) {
  const user = await getAuthorization(ctx);
  if (user && !roles.includes(user.role)) throwError(ctx, 405);
  return user;
}
