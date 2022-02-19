import Router from '@koa/router';
import { sql_getRoleList } from '../../spider/role';
const role = new Router();

// 获取所有角色
role.get('/', async(ctx, next) => {
  ctx.body = await sql_getRoleList();
  next();
})

export = role;