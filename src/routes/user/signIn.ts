import { Context } from 'koa';
import { throwError } from '@/services/errorDealWith';
import { publishJwt, verifyJwt } from '@/services/jwt';
import { sql_queryUserData } from '@/spider/user';
import redis from '@/services/redis';

export const signInUsersKey = 'signInUsers';



export default async(ctx: Context, next: Function) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    throwError(ctx, 406);
  }

  const rows = await sql_queryUserData(username);
  const userData = rows[0];

  if (!userData) {
    throwError(ctx, 500, '用户不存在');
  }
  
  if (username !== userData.name || password !== await verifyJwt(userData.pass)) {
    throwError(ctx, 500, '用户名或密码错误');
  }

  // 添加到 redis 里
  redis.deposit(signInUsersKey, async () => {
    const list = await redis.deposit(signInUsersKey) || [];
    const index = list.findIndex(val => val.name === username);
    const { pass, ...args } = userData;
    index < 0 && list.push(args);
    return list;
  }, -1, true);

  ctx.body = {
    token: publishJwt({ name: username, pass: password, id: userData.id, role: userData.role })
  };
  next();
}