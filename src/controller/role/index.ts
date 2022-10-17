import { Context, Next } from 'koa';
import { sql_getRoleList } from '../../spider/role';

export default class {

  /**
   * 获取所有角色
   */
  static async gain(ctx: Context, next: Next) {
    ctx.body = await sql_getRoleList();
    next();
  }

}
