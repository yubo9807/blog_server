import { throwError } from '@/services/errorDealWith';
import { sql_addAccessRecord } from '@/spider/access';
import Router from '@koa/router';
const access = new Router();

// 记录访问信息
access.post('/', async(ctx, next) => {
  const { createTime, url, ip, forwarded, userAgent, accept, referer, encoding } = ctx.request.body;
  
  if ([createTime, url, ip].includes(void 0)) throwError(ctx, 406);

  await sql_addAccessRecord({ createTime, url, ip, forwarded, userAgent, accept, referer, encoding });
  
  ctx.body = 'success';
  next();
})

export = access;
