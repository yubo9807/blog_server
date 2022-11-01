import { throwError } from "@/services/errorDealWith";
import { verifyJwt } from "@/services/jwt";
import { asyncto } from "@/utils/network";
import { Context, Next } from "koa"

type power = string | number

/**
 * 权限控制
 * @param roles 用户角色
 */
export default (...roles: power[]) => {
  return async (ctx: Context, next: Next) => {
    const { authorization } = ctx.headers;
    !authorization && throwError(ctx, 401); 

    const [ err, res ] = await asyncto(verifyJwt(authorization));
    err && throwError(ctx, 403);

    if (res && roles.includes(res.role)) {
      await next();
    } else {
      throwError(ctx, 405);
    }
  }
}