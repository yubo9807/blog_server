import { check_paging } from "@/common/check";
import { getRouteList } from "@/services/koa-router";
import { Context, Next } from "koa";

export default class {


  static async gain(ctx: Context, next: Next) {

    const { pageNumber, pageSize } = check_paging(ctx.query)(ctx);

    ctx.body = {
      list:  getRouteList().splice(pageNumber - 1, pageSize),
      total: getRouteList().length,
    }

    next();
  }
}
