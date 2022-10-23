import { getAuthorization } from "@/services/authorization";
import { throwError } from "@/services/errorDealWith";
import redis from "@/services/redis";
import { sql_addBlockList, sql_queryBlockList } from "@/spider/blacklist";
import { getClientIP } from "@/utils/network";
import { Context, Next } from "koa";

let lock = false;

/**
 * 中间件：数据防刷
 */
export default async(ctx: Context, next: Next) => {

	const IP = getClientIP(ctx);


	// #region 检查是否在黑名单中
	const key = `blacklist`;
	const blackList = await redis.deposit(key, async () => {
		return await sql_queryBlockList();
	});
	const index = blackList.findIndex(val => val.ip === IP);
	if (index >= 0) {
		// 不对登录进行限制
		const { body } = ctx.request;
		if (ctx.url === '/api/user/signIn' && body && body.username === 'yubo') return;

		// 不对超管访问进行限制
		const user = await getAuthorization(ctx, false);
		if (user && user.role === 'super') return;

		throwError(ctx, 500, `检测到您有恶意攻击行为，已被限制访问。IP： ${IP}`, false);
	}
	// #endregion


	// #region 记录请求频率
	const count = await requestCount(IP);
	ctx.state.request_rate = count;

	const requestKey = `requestNumber_${IP}`;
	redis.deposit(requestKey, count, -1, true);

	// 恶意请求，对本机 IP 不做添加
	if (count > 80 && !lock && !['127.0.0.1', '::1'].includes(IP)) {
		await sql_addBlockList(IP, count);
		redis.deposit(key, async() => {
			return await sql_queryBlockList();
		}, -1, true);

		lock = true;  // 加锁，只添加一次
		throwError(ctx, 508);
	}

	// 请求频次过高，做出警告
	if (count > 40) {
		throwError(ctx, 503, null, false);
	} else {
		lock = false;
		return await next();
	}
	// #endregion


}


const countMap = new Map();

/**
 * 请求计数
 * @param key  存入数据键
 * @param time 过期时间
 * @returns 
 */
function requestCount(key: string, time = 5000) {
  const cache = countMap.get(key);
  const initial = { value: 1, overTime: Date.now() + time }

  if (!cache) {
    countMap.set(key, initial);
  } else {
    if (cache.overTime - Date.now() <= 0) {  // 过期
      countMap.set(key, Object.assign({}, initial));
    } else {
      countMap.set(key, Object.assign({}, cache, { value: cache.value + 1 }));
    }
  }

  return countMap.get(key).value;
}
