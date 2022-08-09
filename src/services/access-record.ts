import { Context, Next } from "koa";
import logger, { LogLevel } from 'logger';
import { dateFormater, getNowDate } from '@/utils/date';
import fs from 'fs';
import env from '@/env';

/**
 * 中间件，日志记录
 */
export default async (ctx: Context, next: Next) => {

  const { url, headers } = ctx;

  const data = {
    host: headers.host,
    url: url,
    accessTime: getNowDate(),
    ip: headers['x-forwarded-for'],
    userAgent: headers['user-agent']
  };

  for (const key in data) {
    const value = data[key];
    if (typeof value === 'string') data[key] = value ? value.replace(/\"/g, '') : '';
  }

  const filename = dateFormater('YYYY-MM-DD', Date.now());
  createAccessRecord(filename, JSON.stringify(data) + ',');

  await next()

}


/**
 * 创建一条访问记录
 * @param filename 添加到哪个文件下
 * @param data 添加数据
 */
export function createAccessRecord(filename: string, data: string) {
  const folder = `${env.BASE_PUBLIC}/access`;
  fs.stat(folder, e => {  // 文件是否存在
    if (e?.code === 'ENOENT') fs.mkdirSync(folder);

    const log = logger.createLogger(`${folder}/${filename}.log`);
    log.format = function(level: LogLevel, date: Date | string, message: string) {
      return message;
    };
    log.info(data);
    
  });
}