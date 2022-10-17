import { Context } from "koa";
import { sql_getUserList } from "../../spider/user";

export default class {

  /**
   * 获取用户列表
   */
  static async gain(ctx: Context, next: Function) {
    ctx.body = await sql_getUserList();
    next();
  }

}