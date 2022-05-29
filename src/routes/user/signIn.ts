import { Context } from 'koa';
import { throwError } from '../../services/errorDealWith';
import { publishJwt, verifyJwt } from '../../services/jwt';
import { sql_queryUserData } from '../../spider/user';

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

  // ctx.cookies.set(cookieKey, publishJwt({ name: username, pass: password }), {
  //   domain: 'localhost'
  // });
  ctx.body = {
    token: publishJwt({ name: username, pass: password, id: userData.id, role: userData.role })
  };
  next();
}