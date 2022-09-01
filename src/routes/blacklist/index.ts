import { sql_addBlockList, sql_deleteBlockList, sql_queryBlockList } from '@/spider/blacklist';
import { throwError } from '@/services/errorDealWith';
import { powerDetection } from '@/services/authorization';
import redis from '@/services/redis';
import Router from '@koa/router';
const route = new Router();


// 获取黑名单列表
route.get('/', async(ctx, next) => {
  const isPower = await powerDetection(ctx, ['super', 'visitor']);
  !isPower && throwError(ctx, 405);
  const blacklist = await sql_queryBlockList();

  ctx.body = blacklist;
  await next();
})


// 添加到黑名单
route.post('/', async(ctx, next) => {
  const isPower = await powerDetection(ctx, ['super']);
  !isPower && throwError(ctx, 405);

  const { ip } = ctx.request.body;
  if (!ip) throwError(ctx, 406);

  const rows = await sql_queryBlockList(ip);
  if (rows[0]) throwError(ctx, 500, 'ip 已存在');

	await sql_addBlockList(ip);

  redis.deposit('blacklist', async() => {
    return await sql_queryBlockList();
  }, -1, true);

  ctx.body = 'success';
  next();
})


// 删除名单中的IP
route.delete('/', async(ctx, next) => {
  const isPower = await powerDetection(ctx, ['super']);
  !isPower && throwError(ctx, 405);

  const { id } = ctx.request.body;
  if (!id) throwError(ctx, 406);

  await sql_deleteBlockList(id);
  redis.deposit('blacklist', async() => {
    return await sql_queryBlockList();
  }, -1, true);

  ctx.body = 'success';
  await next();
})


export = route;
