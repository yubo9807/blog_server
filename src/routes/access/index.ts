import { throwError } from '@/services/errorDealWith';
import Router from '@koa/router';
import { dateFormater, getNowDate } from '@/utils/date';
import File from '@/utils/file';
import { pathConversion } from '@/env';
import { createAccessRecord } from '@/middleware/access-record';

const access = new Router();
const file = new File();
const baseFilename = pathConversion('/access');


// 获取访问记录
access.get('/', async (ctx, next) => {
  const { startTime, endTime } = ctx.query;

  let list = [];

  let filenameList = (await file.getChildren(baseFilename)).map(val => val.name.replace('.log', ''));

  // 确认需要查的文件
  if (startTime || endTime) {
    const start = startTime ? dateFormater('YYYY-MM-DD', (startTime as any) * 1000) : filenameList[0];
    const end = endTime ? dateFormater('YYYY-MM-DD', (endTime as any) * 1000) : filenameList[filenameList.length - 1];
    filenameList = filenameList.filter(val => {
      if (val >= start && val <= end) return val;
    })
  }
  
  // 查找文件内容并转为 json 数据
  for await (const name of filenameList) {
    const content: string = await file.getContent(`${baseFilename}/${name}.log`);
    const json = JSON.parse(`[${content.trim().slice(0, -1)}]`);
    list.push(json);
  }
  list = list.flat(1);

  const len = list.length;
  if (len > 0 && (startTime || endTime)) {
    const start = startTime || list[0].accessTime;
    const end = endTime || list[len - 1].accessTime + 1;
    list = list.filter(val => {
      if (val.accessTime >= start && val.accessTime < end) return val;
    })
  }
  
  ctx.body = list;
  next();
})


// 记录访问信息
access.post('/', async(ctx, next) => {
  const { url, ip, userAgent } = ctx.request.body;
  
  if (typeof url !== 'string' || url === '') throwError(ctx, 406);

  const data = {
    url,
    accessTime: getNowDate(),
    ip,
    userAgent,
  }

  const filename = dateFormater('YYYY-MM-DD', Date.now());
  createAccessRecord(filename, JSON.stringify(data) + ',');

  ctx.body = 'success';
  next();
})

export = access;
