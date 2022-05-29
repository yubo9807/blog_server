import { Context } from "koa";
import { errorDealWith } from "../../services/errorDealWith";
import { verifyJwt } from "../../services/jwt";
import { sql_getUserList } from "../../spider/user";
import { getAuthorization } from '@/services/authorization';

export default async(ctx: Context, next: Function) => {
  const user = await getAuthorization(ctx);

  const { name } = user;

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
