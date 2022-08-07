import fs from 'fs';
import Router from '@koa/router';
import { marked } from 'marked';

import env, { pathConversion } from '@/env';
import { throwError } from '@/services/errorDealWith';
import { powerDetection } from '@/services/authorization';
import File from '@/utils/file';
import redis from '@/services/redis';

const rouer = new Router();


// 获取文件夹下的文件夹和文件
rouer.get('/', async(ctx, next) => {
  const path = decodeURI(ctx.query.path as string);
  let filename = pathConversion(path);
  !fs.existsSync(filename) && throwError(ctx, 500, '路径不存在');

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
})


rouer.get('/logs', async(ctx, next) => {
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
})

export = rouer;



/**
 * 获取文件内容或子目录
 * @param filename 
 * @returns 
 */
async function getFileContentOrChildDirectory(filename: string, replacePath = '') {
  let body: any;
  
  const fileAttr: any = await File.getStat(filename);
  
  if (fileAttr.isFile) {
    fileAttr.path = fileAttr.filename.replace(replacePath, '');

    // 是文件，返回文件内容
    const file = new File();
    let content = await file.getContent(filename);
    fileAttr.ext === '.md' && (content = marked.parse(content));
    body = { ...fileAttr, content };

  } else {

    // 不是文件返回子目录
    const file = new File();
    const arr = await file.getChildren(filename);
    arr.forEach(val => {
      val.path = val.filename.replace(replacePath, '');
    });

    // 排序
    arr.sort((a: any, b: any) => {
      const beginWith = /^\d/;
      if (beginWith.test(a.name) && beginWith.test(b.name)) return parseInt(a.name) - parseInt(b.name);
      else return new Intl.Collator('en').compare(a.name, b.name);
    });

    body = arr;

  }
  
  return body;
}
