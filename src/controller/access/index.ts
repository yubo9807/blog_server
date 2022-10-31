import { throwError } from '@/services/errorDealWith';
import { dateFormater, getNowDate } from '@/utils/date';
import File from '@/utils/file';
import { pathConversion } from '@/env';
import { createAccessRecord } from '@/middleware/access-record';
import { Context, Next } from 'koa';
import { check_paging } from '@/common/check';

const file = new File();
const baseFilename = pathConversion('/access');

export default class {

  // #region 获取访问记录
  /**
   * 获取访问记录
   */
  static async gain(ctx: Context, next: Next) {
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
  }

  /**
   * 对获取到的访问数据进行分页
   */
  static paging(ctx: Context, next: Next) {
    const { pageNumber, pageSize } = check_paging(ctx.query)(ctx);

    const list = ctx.body;
    ctx.body = {
      list:   Object.assign([], list).splice(pageNumber - 1, pageSize),
      length: Object.assign([], list).length,
    }

    next();
  }

  /**
   * 对获取到的访问数据生成统计数据
   */
  static statistical(ctx: Context, next: Next) {
    const list = ctx.body;

    const obj = {};
    (list as any[]).forEach(val => {
      const key = dateFormater('MM-DD', val.accessTime * 1000);
      !obj[key] && (obj[key] = 0);
      obj[key] = obj[key] + 1;
    })

    ctx.body = obj;
    next();
  }
  // #endregion



  /**
   * 写入访问记录
   */
  static async write(ctx: Context, next: Next) {
    const { host, url, ip, userAgent } = ctx.request.body;
  
    if (typeof url !== 'string' || url === '') throwError(ctx, 406);

    const data = {
      accessTime: getNowDate(),
      url,
      host,
      ip,
      userAgent,
    }

    const filename = dateFormater('YYYY-MM-DD', Date.now());
    createAccessRecord(filename, JSON.stringify(data) + ',');

    ctx.body = 'success';
    await next();
  }

}

