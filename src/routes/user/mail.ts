import { Context } from "koa";
import { errorDealWith } from "../../services/errorDealWith";
import redis from "../../services/redis";
import { mailDelivery } from '../../services/sendMail';
import { randomNum } from '../../utils/number';

export async function getMailCode(ctx: Context, next: Function) {
  const { mail } = ctx.query;
  
  if (!mail) {
    errorDealWith(ctx, 406);
  }

  await redis.deposit(mail, async() => {
    const random = String(randomNum(1000000));
    mailDelivery(mail as string, '验证码', random);
    return random;
  }, 1000 * 60 * 5, true)  // 缓存 5 分钟
  
  ctx.body = 'success';
  next();
}