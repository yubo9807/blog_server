import { sql_getFriendLinkList, sql_addFriendLink, sql_deleteFriendLink, sql_modifyFriendLink } from '../../spider/friendLink';
import { throwError } from '../../services/errorDealWith';
import { Context, Next } from 'koa';

export default class {

  /**
   * 获取友链列表
   */
  static async list(ctx: Context, next: Next) {
    ctx.body = await sql_getFriendLinkList();
    await next();
  }

  /**
   * 删除友链
   */
  static async delete(ctx: Context, next: Next) {
    const { id } = ctx.request.body;
    if (!id) {
      throwError(ctx, 406, 'params error');
    }
    ctx.body = await sql_deleteFriendLink(id);
    await next();
  }

  /**
   * 添加友链
   */
  static async add(ctx: Context, next: Next) {
    const { name, link, remark } = ctx.request.body;
    if (!name || !link) {
      throwError(ctx, 406, 'params error');
    }
    await sql_addFriendLink({ name, link, remark, create_time: Date.now() })
    ctx.body = 'add to success';
    await next();
  }

  /**
   * 修改友链
   */
  static async modify(ctx: Context, next: Next) {
    const { id, name, link, remark } = ctx.request.body;
    const params = {
      id,
      name,
      link,
      remark
    }
    ctx.body = await sql_modifyFriendLink(params);
    await next();
  }

}
