import { Context } from "koa";
import redis from './redis';
import { sql_addBlockList, sql_queryBlockList } from '@/spider/blacklist';
import { throwError } from "./errorDealWith";
import { getClientIP } from '@/utils/network';
import { getAuthorization } from "./authorization";

let requestRate = 1;  // 请求频率

/**
 * 请求计数
 * @param ctx 
 * @param time 一定时间内（ms）
 * @param maxRequestNumber 允许最大请求数
 */
async function requestCount(ctx: Context, time = 5000, maxRequestNumber = 20) {
	const IP = getClientIP(ctx);
	const requestStr = await redis.deposit(`requestNumber_${IP}`, 1, time, false, true);

	if (requestStr.cache) requestRate ++;
	else {
    // console.log(Math.floor(Date.now() / 1000), requestRate);
		// 重置次数前记录下请求次数
		requestRate = 1;
	}

  ctx.state.request_rate = requestRate;

	// 请求频率超过了设定值
	if (requestRate > maxRequestNumber) {
    return true;
	}
  return false;
}


const key = 'blacklist';

export default async function(ctx: Context) {
	const IP = getClientIP(ctx);
	const queryBlackList = await redis.deposit(key, async () => {
		return await sql_queryBlockList(IP);
	});
	if (queryBlackList[0]) {
		// 不对超管登录进行限制
		const { body } = ctx.request;
		if (ctx.url === '/api/user/signIn' && body && body.username === 'yubo') return;

		// 不对超管访问进行限制
		const user = await getAuthorization(ctx, false);
		if (user && user.role === 'super') return;

		throwError(ctx, 500, `检测到您有恶意攻击行为，已被限制访问。IP： ${IP}`, false);
	}
	const beyondRefresh = await requestCount(ctx);
	if (beyondRefresh) {
		const { request_rate } = ctx.state;
		if (request_rate > 80) {  // 请求频率超过100，加入黑名单
			await sql_addBlockList(IP, request_rate);

			// 覆盖掉缓存中的数据
			await redis.deposit(key, async () => {
				return await sql_queryBlockList(IP);
			}, -1, true);
		}
		throwError(ctx, 513, null, false);
	}
}