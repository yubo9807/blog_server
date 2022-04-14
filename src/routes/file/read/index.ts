import fs from 'fs';
import Router from '@koa/router';
import { marked } from 'marked';

import { pathConversion } from '@/env';
import { errorDealWith } from '@/services/errorDealWith';
import ReadFile from '@/services/readFile';
import redis from '@/services/redis';
import env from '@/env';

const read = new Router();

// 获取文件夹下的文件夹和文件
read.get('/', async(ctx, next) => {
  const { path } = ctx.query;
  const filename = pathConversion((path as string));

  !fs.existsSync(filename) && errorDealWith(ctx, 500, '路径不存在');

  const body = await redis.deposit(ctx, async() => {
    return await getFileContentOrChildDirectory(filename);
  }, 1000 * 60 * 20);
  
  ctx.body = body;
  next();
})

export = read;



/**
 * 获取文件内容或子目录
 * @param filename 
 * @returns 
 */
async function getFileContentOrChildDirectory(filename: string) {
  let body: string | any[] | Buffer = '';
  
  const fileAttr = await ReadFile.getFile(filename);
  
  if (fileAttr.isFile) {
    // 是文件，返回文件内容
    const content = await fs.promises.readFile(filename, 'utf-8');
    fileAttr.ext === '.md'
      ? body = marked.parse(content)
      : body = content;
  } else {
    // 不是文件返回子目录
    const readFile = new ReadFile(filename);
    const arr = await readFile.getChildren();
    arr.forEach(val => val.path = val.filename.replace(env.BASE_PUBLIC, ''));
    arr.sort((a: any, b: any) => {
      const beginWith = /^\d/;
      if (beginWith.test(a.name) && beginWith.test(b.name)) return parseInt(a.name) - parseInt(b.name);
      else return new Intl.Collator('en').compare(a.name, b.name);
    });
    body = arr;
  }
  
  return body;
}
