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

	const beyond = await requestCount(ctx);
	if (beyond) {
		lock && throwError(ctx, 508, null, false);
	} else {
		lock = false;  // 请求频次刷新，关闭锁
		return await next();
	}

	const { request_rate } = ctx.state;
	if (request_rate > 60 && !lock) {  // 请求频率过高，加入黑名单
		lock = true;  // 加锁，防止并发请求次数持续升高
		await sql_addBlockList(IP, request_rate);

		// 覆盖缓存中黑名单数据
		await redis.deposit(key, async() => {
			return await sql_queryBlockList();
		}, -1, true);
	}
	throwError(ctx, 503, null, false);

}


let requestRate = 1;  // 请求频率

/**
 * 请求计数
 * @param ctx 
 * @param time 一定时间内（ms）
 * @param maxRequestNumber 允许最大请求数
 */
async function requestCount(ctx: Context, time = 5000, maxRequestNumber = 30) {
	const IP = getClientIP(ctx);
	const key = `requestNumber_${IP}`
	const requestStr = await redis.deposit(key, requestRate, time, false, true);

	requestRate = requestStr.cache ? requestRate+1 : 1;
	redis.deposit(key, requestRate, time, true);

  ctx.state.request_rate = requestRate;

	// 请求频率超过了设定值
	if (requestRate > maxRequestNumber) {
    return true;
	}
  return false;
}
