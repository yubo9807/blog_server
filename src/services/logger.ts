
import { Context } from 'koa';
import logger, { LogLevel } from 'logger';
import fs from 'fs';
import env from '../env';
import { dateFormater } from "../utils/date";

/**
 * 生成一条日志
 * @param filename 
 * @param logs
 */
export async function createLogger(filename: string, ...logs: any) {
  const folder = `${env.BASE_URL}/logs`;
  fs.stat(folder, e => {
    if (e?.code === 'ENOENT') fs.mkdirSync(folder);

    const log = logger.createLogger(`${folder}/${filename}.log`);
    log.format = function(level: LogLevel, date: Date | string, message: string) {
      const time = dateFormater('hh:mm:ss', date);
      return time + message;
    };
    log.info(logs.join(' '));
    
  });  // 文件是否存在
}

/**
 * 打印错误日志
 * @param ctx 
 * @param error 
 */
export function printErrorLogs(ctx: Context, error: Error) {
  const { url, query, request, state, method, headers } = ctx;
  const day = dateFormater('YYYY-MM-DD');

  const arr = [
    url, method,
    '\nParams:', JSON.stringify(query),
    '\nData:', JSON.stringify(request.body),
    '\nHeaders:', JSON.stringify(headers),
  ];

  if (state.code >= 500) {
    arr.push('\nBody:' + error.message);
  } else {
    arr.push('\n' + error.stack);
  }

  createLogger(day, ...arr);
}