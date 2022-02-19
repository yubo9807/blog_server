import { Context } from 'koa';

/**
 * 将 code 码统一，方便前端拦截器处理
 * @param ctx
 * @param code 
 * @param msg 
 */
export function errorDealWith(ctx: Context, code: number = 500, msg: string = 'business logic error') {

  if (code === 500 && ['', undefined, null].includes(msg)) {
    throw new Error('param \'msg\' cannot be empty');  // 防止开发者传参导致后面数据返回 code:404
  }

  const errorMsg = {

    // 4xx 开发者所犯错误
    400: msg || 'unknown error',  // 未知错误
    403: 'token overdue',  // token 过期
    404: 'invalid url',  // 接口不存在，无效 url
    405: 'power error',  // 当前角色没有权限
    406: 'params error',  // 传参错误

    // 5xx 给用户看的错误
    500: msg,  // 业务逻辑错误
    501: '暂不支持业务功能',
    513: '服务器忙，请稍后重试',

  }

  ctx.state.msg = errorMsg[code];
  ctx.state.code = code;

  ctx.throw(200, JSON.stringify(ctx.state));

}
