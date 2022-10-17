import env from "@/env";
import fs from 'fs';
import { powerDetection } from "@/services/authorization";
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
    
    // 获取的是日志文件，添加权限
    const isPower = await powerDetection(ctx, ['super']);
    !isPower && throwError(ctx, 405);
  
    !fs.existsSync(filename) && throwError(ctx, 500, '路径不存在');
    const body = await getFileContentOrChildDirectory(filename, baseUrl);
  
    ctx.body = body;
    next();
  }

}
