import { sql_appMenuList, sql_deleteMenuList, sql_getMenuList, sql_modifyMenuConfig, sql_modifyMenuList, sql_replaceMenuOrder } from '@/spider/menu';
import { throwError } from '@/services/errorDealWith';
import { Context, Next } from 'koa';

export default class {

  /**
   * 获取所有菜单
   */
  static async list(ctx: Context, next: Next) {
    ctx.body = await sql_getMenuList();
    await next();
  }

  /**
   * 初始化菜单
   */
  static async init(ctx: Context, next: Next) {
    const { addMenuList, modifyMenuList, deleteMenuList } = ctx.request.body;
  
    addMenuList.length > 0 && await sql_appMenuList(addMenuList);
    deleteMenuList.length > 0 && await sql_deleteMenuList(deleteMenuList);
    modifyMenuList.length > 0 && await sql_modifyMenuList(modifyMenuList);
    
    ctx.body = 'success';
    next();
  }

  /**
   * 修改排序
   */
  static async order(ctx: Context, next: Next) {
    const { replaceArr } = ctx.request.body;
    if (replaceArr instanceof Array && replaceArr.length === 2) {
      await sql_replaceMenuOrder(replaceArr[0], replaceArr[1]);
    } else {
      throwError(ctx, 406);
    }
    
    ctx.body = 'success';
    next();
  }

  /**
   * 修改菜单配置
   */
  static async config(ctx: Context, next: Next) {
    const { id, config } = ctx.request.body;
  
    if (config instanceof Object && id) {
      await sql_modifyMenuConfig(id, config);
      ctx.body = 'success';
      next();
    }
  
    throwError(ctx, 406);
  }
}
