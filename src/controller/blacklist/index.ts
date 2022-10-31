import { sql_addBlockList, sql_deleteBlockList, sql_queryBlockList } from '@/spider/blacklist';
import { throwError } from '@/services/errorDealWith';
import redis from '@/services/redis';
import { Context, Next } from 'koa';


export default class {

  /**
   * 获取黑名单列表
   */
  static async list(ctx: Context, next: Next) {
    const blacklist = await sql_queryBlockList();

    ctx.body = blacklist;
    await next();
  }

  /**
   * 添加到黑名单列表
   */
  static async add(ctx: Context, next: Next) {
    const { ip } = ctx.request.body;
    if (!ip) throwError(ctx, 406);
  
    const rows = await sql_queryBlockList(ip);
    if (rows[0]) throwError(ctx, 500, 'ip 已存在');
  
    await sql_addBlockList(ip);
  
    redis.deposit('blacklist', async() => {
      return await sql_queryBlockList();
    }, -1, true);
  
    ctx.body = 'success';
    await next();
  }

  /**
   * 从黑名单列表中删除
   */
  static async delete(ctx: Context, next: Next) {
    const { id } = ctx.request.body;
    if (!id) throwError(ctx, 406);
  
    await sql_deleteBlockList(id);
    redis.deposit('blacklist', async() => {
      return await sql_queryBlockList();
    }, -1, true);
  
    ctx.body = 'success';
    await next();
  }
}
