import env from "@/env";
import fs from 'fs';
import { throwError } from "@/services/errorDealWith";
import { Context, Next } from "koa";
import { getFileContentOrChildDirectory } from './utils/file';


export default class {

  /**
   * 读取日志文件
   */
  static async read(ctx: Context, next: Next) {
    const path = decodeURI(ctx.query.path as string);
    const baseUrl = env.BASE_ROOT + '/logs';
    let filename = baseUrl + path;

    !fs.existsSync(filename) && throwError(ctx, 500, '路径不存在');
    const body = await getFileContentOrChildDirectory(filename, baseUrl);
  
    ctx.body = body;
    next();
  }

}
