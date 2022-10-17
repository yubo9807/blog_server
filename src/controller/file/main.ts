import fs from 'fs';
import env, { pathConversion } from '@/env';
import { throwError } from '@/services/errorDealWith';
import redis from '@/services/redis';
import { Context, Next } from 'koa';
import { getFileContentOrChildDirectory, searchFile } from './utils/file';

export default class {

  /**
   * 读取文件
   * @note 返回一个文件数组或文件属性对象
   */
  static async read(ctx: Context, next: Next) {
    const path = decodeURI(ctx.query.path as string);
    let filename = pathConversion(path);
    !fs.existsSync(filename) && throwError(ctx, 500, '文件路径不存在');
  
    let body = '';
  
    // 对笔记文件做缓存
    if (path.startsWith('/note')) {
      body = await redis.deposit(ctx, async() => {
        return await getFileContentOrChildDirectory(filename, env.BASE_PUBLIC);
      }, 1000 * 60 * 20);
    }
  
    body = await getFileContentOrChildDirectory(filename, env.BASE_PUBLIC);
  
    ctx.body = body;
    next();
  }

  /**
   * 搜索文件
   */
  static async search(ctx: Context, next: Next) {
    const { basePath, text } = ctx.query;
    const filename = pathConversion((basePath as string));
    !fs.existsSync(filename) && throwError(ctx, 500, '路径不存在');
  
    const filenameArr = await redis.deposit(ctx, async () => {
      return await searchFile(filename, (text as string))
    }, 1000 * 60 * 10);
  
    ctx.body = filenameArr;
    next();
  }

}


