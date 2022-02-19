import { Context } from "koa";
import { errorDealWith } from "../../services/errorDealWith";
import redis from "../../services/redis";
import { sql_getUserList } from "../../spider/user";

export default async(ctx: Context, next: Function) => {
  const { userName, oldPasswrod, mail, mailCode } = ctx.query;
  if (!userName || !mail || !mailCode) {
    errorDealWith(ctx, 406);
  }
  
  const rows = await sql_getUserList(userName);
  if (!rows[0]) {
    errorDealWith(ctx, 500, '用户不存在');
  }
  if (userName === rows[0].name && mail !== rows[0].mail) {
    errorDealWith(ctx, 500, '邮箱错误');
  }

  const randomNum = await redis.deposit(mail);
  if (mailCode !== randomNum) {
    errorDealWith(ctx, 500, '验证码错误');
  }

  ctx.body = '修改成功';
  next();
}