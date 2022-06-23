import Router from '@koa/router';
import redis from '@/services/redis';
import { powerDetection } from '@/services/authorization';
import { throwError } from '@/services/errorDealWith';

const route = new Router();

// 获取 redis 数据
route.get('/', async(ctx, next) => {

  ctx.body = {
    data: redis.gainAll(),
    length: redis.length(),
    size: redis.size(),
  };
  next();
})

// 清空 redis
route.delete('/', async(ctx, next) => {
  
  const isPower = await powerDetection(ctx, ['super']);
  !isPower && throwError(ctx, 405);
  
  const { key } = ctx.request.body;

  if (key) redis.delete(key);
  else redis.clear();

  ctx.body = 'success';
  next();
})

export = route;
