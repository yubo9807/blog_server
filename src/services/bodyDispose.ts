import env from '../env';
import { Context } from 'koa';
import { errorDealWith } from './errorDealWith';
import preventDataRefresh from './preventDataRefresh';
import { sql_addBlockList, sql_queryBlockList } from '@/spider/blacklist';

export default async(ctx: Context, next: () => {}) => {

	if (!ctx.originalUrl.startsWith(env.BASE_API)) {
		return await next();
	};

	const startTime = Date.now();
	ctx.state.code = 400;
	ctx.state.msg = '';
	ctx.state.request_rate = 1;  // 请求频率
	ctx.state.redis_cache = false;

	// 数据防刷
	const queryBlackList = await sql_queryBlockList(ctx.request.ip);
	if (queryBlackList[0]) {
		errorDealWith(ctx, 500, '您已被限制访问，请联系管理员', false);
	}
	const beyondRefresh = await preventDataRefresh(ctx);
	if (beyondRefresh) {
		const { request_rate } = ctx.state;
		if (request_rate > 100) {  // 请求频率超过100，加入黑名单
			await sql_addBlockList(ctx.request.ip, request_rate);
		}
		errorDealWith(ctx, 513, null, false);
	}

	// 打印日志
	try {
		await next();
	} catch (error) {
		// code 依然为 400，说明错误并没有被捕获到
		if (ctx.state.code === 400 && error) {
			errorDealWith(ctx, 400);
		}
	}

	// 等待所有中间件完成后执行，规范数据格式
	const { state, body } = ctx;
	const endTime = Date.now();

	if (state.msg == '' && !body) {  // 没错误消息，也没body
		errorDealWith(ctx, 404, null, false);
	} else if (body) {  // 正常返回数据
		ctx.body = {
			code: 200,
			msg: 'success',
			data: body,
			redis_cache: state.redis_cache,  // 是否具有缓存
			request_rate: state.request_rate,  // 请求频率 10/5s
			run_time: endTime - startTime,  // 代码执行时间
		}
	} else {  // 其他异常情况，自行设置 code msg 进行处理
		ctx.body = {
			...state,
			run_time: endTime - startTime,
		}
	}

}
