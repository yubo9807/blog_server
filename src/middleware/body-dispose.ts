import { Context, Next } from 'koa';
import env from '@/env';
import { throwError } from '@/services/errorDealWith';
import { printErrorLogs } from '@/services/logger';
import { getRouteList } from '@/services/koa-router';

/**
 * 中间件：处理 body 数据
 */
export default async(ctx: Context, next: Next) => {

	if (!ctx.originalUrl.startsWith(env.BASE_API)) {
		return await next();
	};

	const startTime = Date.now();
	ctx.state.code = 400;
	ctx.state.msg = '';
	ctx.state.redis_cache = false;

	// 没配置过该路由
	const index = getRouteList().findIndex(val => val.path === ctx.URL.pathname && val.method === ctx.method);
	if (index < 0) {
		throwError(ctx, 404, null, false);
	}
	
	// 捕获中间件错误，打印日志
	try {
		await next();
	} catch (error) {
		// code 依然为 400，说明错误并没有被捕获到
		if (ctx.state.code === 400 && error) {
			printErrorLogs(ctx, error);
			throwError(ctx, 400, null, false);
		}
	}
	
	// 等待所有中间件完成后执行，规范数据格式
	const { state, body } = ctx;
	const endTime = Date.now();

	if (body) {  // 正常返回数据
		ctx.body = {
			code:         200,
			msg:          'success',
			data:         body,
			redis_cache:  state.redis_cache,    // 是否具有缓存
			request_rate: state.request_rate,   // 请求频率
			run_time:     endTime - startTime,  // 代码执行时间
		}
	} else {  // 其他异常情况，自行设置 code msg 进行处理
		ctx.body = {
			...state  ,
			run_time: endTime - startTime,
		}
	}

}
