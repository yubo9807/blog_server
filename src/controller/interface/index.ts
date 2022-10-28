import { check_paging } from "@/common/check";
import { getRouteList } from "@/services/koa-router";
import { Context, Next } from "koa";

export default class {


  static async gain(ctx: Context, next: Next) {

    const { pageNumber, pageSize } = check_paging(ctx.query)(ctx);

    const list = getRouteList().filter(val => {
      if (val.noBack) return false;
      else return true;
    });

    ctx.body = {
      list:  Object.assign([], list).splice(pageNumber - 1, pageSize),
      total: Object.assign([], list).length,
    }

    next();
  }
}
