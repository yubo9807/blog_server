import Redis from './runing-redis';
import cache from './runing-redis/cache';

const redis = new Redis(1024 * 1024 * 5);

export default {
  /**
   * 储存数据，如果已经存在并且没有过期你会直接获取到该数据
   * @param ctx      koa 上下文
   * @param value    是一个函数时(必须返回数据)：可以进行数据请求，有缓存时并不会执行；其他类型：直接将数据存放进去
   * @param overTime 过期时间，为 -1 时数据不过期。设置更小的数无意义
   * @param cover    强制覆盖数据
   * @param cache    想知道有获取的数据有没有缓存
   * @returns        返回设置的 value
   */
  async deposit(ctx, value?: any, overTime = -1, cover = false, cache = false) {
    let res = null;
    if (['string', 'symbol'].includes(typeof ctx)) {
      res = await redis.deposit(ctx, value, overTime, cover)
    } else {
      res = await redis.deposit(ctx.request.url, value, overTime, cover)
      ctx.state.redis_cache = res.cache;
    }
    if (cache) return res;
    else return res.data;
  },

  /**
   * 清空数据
   */
  clear() {
    cache.clear();
  },

  delete(key: string | symbol) {
    cache.delete(key)
  },

  /**
   * 清除数据（过期的，早以前的）
   */
  clearCache() {
    redis.clearCache();
  },
  
  /**
   * 获取数据存储大小
   */
  size() {
    return cache.size();
  },

  /**
   * 获取存储的所有数据
   */
  gainAll() {
    this.clearCache();
    return cache.gainAll();
  },

  /**
   * 获取数据长度
   */
  length() {
    return cache.length();
  },

}