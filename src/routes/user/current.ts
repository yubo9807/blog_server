import { Context } from "koa";
import { errorDealWith } from "../../services/errorDealWith";
import { verifyJwt } from "../../services/jwt";
import { sql_getUserList } from "../../spider/user";

export default async(ctx: Context, next: Function) => {
  const { token } = ctx.query;
  if (!token) {
    errorDealWith(ctx, 406);
  }

  const { name } = verifyJwt(token);

  if (!name) {
    errorDealWith(ctx, 500, '没有该用户信息');
  }
  const rows = await sql_getUserList(name);
  if (!rows[0]) {
    errorDealWith(ctx, 500, '用户不存在');
  } else {
    ctx.body = rows[0];
  }
  next();
}
