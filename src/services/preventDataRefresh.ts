import { Context } from "koa";
import redis from './redis';
import { sql_addBlockList, sql_queryBlockList } from '@/spider/blacklist';
import { throwError } from "./errorDealWith";

let requestRate = 1;  // 请求频率

/**
 * 请求计数
 * @param ctx 
 * @param time 一定时间内（ms）
 * @param maxRequestNumber 允许最大请求数
 */
async function requestCount(ctx: Context, time = 5000, maxRequestNumber = 20) {
	const IP = ctx.request.ip;
	const requestStr = await redis.deposit(`requestNumber_${IP}`, '请求次数', time, false, true);

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


export default async function(ctx: Context) {
	const key = Symbol('request_number');
	const queryBlackList = redis.deposit(key, async () => {
		return await sql_queryBlockList(ctx.request.ip);
	});
	if (queryBlackList[0]) {
		throwError(ctx, 500, '您已被限制访问，请联系管理员', false);
	}
	const beyondRefresh = await requestCount(ctx);
	if (beyondRefresh) {
		const { request_rate } = ctx.state;
		if (request_rate > 100) {  // 请求频率超过100，加入黑名单
			await sql_addBlockList(ctx.request.ip, request_rate);
		}
		throwError(ctx, 513, null, false);
	}
}