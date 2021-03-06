import fs from 'fs';
import Router from '@koa/router';

import env, { pathConversion } from '@/env';
import { throwError } from '@/services/errorDealWith';

import File from '@/utils/file';
import { asyncto } from '@/utils/network';
import redis from '@/services/redis';

const search = new Router();
const file = new File();


// 获取文件夹下的文件夹和文件
search.get('/', async(ctx, next) => {
  const { basePath, text } = ctx.query;
  const filename = pathConversion((basePath as string));
  !fs.existsSync(filename) && throwError(ctx, 500, '路径不存在');

  const filenameArr = await redis.deposit(ctx, async () => {
    return await searchFile(filename, (text as string))
  }, 1000 * 60 * 10);

  ctx.body = filenameArr;
  next();
})

export = search;

async function searchFile(filename: string, text: string, arr = []) {
  if (!text) return [];
  const children = await file.getChildren(filename);
  for await (const prop of children) {
    if (!prop.isFile) {
      await searchFile(prop.filename, text, arr);
    }
    const [ error, content ] = await asyncto(file.getContent(prop.filename));
    if (!error && content.includes(text)) {
      prop.path = prop.filename.replace(env.BASE_PUBLIC, '');
      const startIndex = content.search(text);
      prop.content = content.slice(startIndex, startIndex + 120);
      arr.push(prop);
    }
  }
  return arr;
}