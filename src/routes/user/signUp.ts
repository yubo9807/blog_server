import { Context } from "koa";
import { errorDealWith } from "../../services/errorDealWith";
import { publishJwt } from "../../services/jwt";
import redis from "../../services/redis";
import { sql_addUser, sql_queryUserData } from "../../spider/user";
import { getNowDate } from '../../utils/date';

export default async(ctx: Context, next: Function) => {
  const { username, password, mail, mailCode, isReceive } = ctx.request.body;

  if (!username || !password) {
    errorDealWith(ctx, 406);
  }

  const rows = await sql_queryUserData(username);
  if (rows[0]) {
    errorDealWith(ctx, 500, '用于已存在');
  }

  // 验证邮箱验证码
  if (mail) {
    const rows = await sql_queryUserData(mail);
    if (rows[0]) {
      errorDealWith(ctx, 500, '该邮箱已注册，请更换邮箱或注销账号');
    }
    if (mailCode) {
      const code = await redis.deposit(mail);
      if (code !== mailCode) {
        errorDealWith(ctx, 500, '验证码错误');
      }
    } else {
      errorDealWith(ctx, 406);
    }
  }

  const pass = publishJwt(password);
  const params = {
    name: username,
    pass: pass,
    mail: mail ?? null,
    create_time: getNowDate(),
    is_receive: isReceive || 0
  }
  
  const row = await sql_addUser(params);
  ctx.body = '注册成功';
  next();
}