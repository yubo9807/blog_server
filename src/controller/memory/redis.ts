import redis from '@/services/redis';
import { powerDetection } from '@/services/authorization';
import { throwError } from '@/services/errorDealWith';
import { Context, Next } from 'koa';

export default class {

  /**
   * 获取 redis 数据
   */
  static async gain(ctx: Context, next: Next) {
    ctx.body = {
      data: redis.gainAll(),
      length: redis.length(),
      size: redis.size(),
    };
    await next();
  }

  /**
   * 清空 redis
   */
  static async clear(ctx: Context, next: Next) {
  
    const isPower = await powerDetection(ctx, ['super']);
    !isPower && throwError(ctx, 405);
    
    const { key } = ctx.request.body;
  
    if (key) redis.delete(key);
    else redis.clear();
  
    ctx.body = 'success';
    await next();
  }

}
