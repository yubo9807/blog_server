import { Context } from 'koa';
import { printErrorLogs } from './logger';

/**
 * 将 code 码统一，方便前端拦截器处理
 * @param ctx
 * @param code code 码
 * @param msg 错误消息，500 的时候传
 * @param print 是否打印日志
 */
export function errorDealWith(ctx: Context, code: number = 500, msg: string = 'business logic error', print = true) {

  if (code === 500 && ['', undefined, null].includes(msg)) {
    throw new Error('param \'msg\' cannot be empty');  // 防止开发者传参导致后面数据返回 code:404
  }

  const errorMsg = {

    // 4xx 开发者所犯错误
    400: 'unknown error',  // 未知错误
    401: 'unauthorized',  // 未授权
    403: 'token overdue',  // token 过期
    404: 'invalid url',  // 接口不存在，无效 url
    405: 'power error',  // 当前角色没有权限
    406: 'params error',  // 传参错误

    // 5xx 给用户看的错误
    500: msg,  // 业务逻辑错误
    501: '暂不支持业务功能',
    513: '服务器忙，请稍后重试',

  }

  const { state } = ctx;
  state.msg = errorMsg[code];
  state.code = code;

  if (print) {
    const error = code === 400 ? new Error(state.msg) : JSON.stringify(state);
    printErrorLogs(ctx, error);
  }

  ctx.throw(200, JSON.stringify(state));

}
