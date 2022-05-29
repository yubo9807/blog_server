import { Context } from "koa";
import redis from './redis';

let requestRate = 1;  // 请求频率

/**
 * 数据防刷
 * @param ctx 
 * @param time 一定时间内（ms）
 * @param maxRequestNumber 允许最大请求数
 */
export default async function (ctx: Context, time = 5000, maxRequestNumber = 20) {
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