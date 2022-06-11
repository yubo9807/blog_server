import Router from '@koa/router';
import { sql_deleteBlockList, sql_queryBlockList } from '@/spider/blacklist';
import { throwError } from '@/services/errorDealWith';
import { powerDetection } from '@/services/authorization';
const blacklist = new Router();

// 获取黑名单
blacklist.get('/', async (ctx, next) => {
  const isPower = await powerDetection(ctx, ['super']);
  !isPower && throwError(ctx, 405);

  const rows = await sql_queryBlockList();
  ctx.body = rows;
  next();
})

// 删除名单中的IP
blacklist.delete('/', async (ctx, next) => {
  const isPower = await powerDetection(ctx, ['super']);
  !isPower && throwError(ctx, 405);

  const { id } = ctx.request.body;
  if (!id) throwError(ctx, 406);

  await sql_deleteBlockList(id);
  ctx.body = 'success';
  next();
})


export = blacklist;
