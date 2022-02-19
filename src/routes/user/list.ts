import { Context } from "koa";
import { sql_getUserList } from "../../spider/user";

export default async(ctx: Context, next: Function) => {
  ctx.body = await sql_getUserList();
  next();
}