import { throwError } from "@/services/errorDealWith";
import { isType, errorSet, isTurnNumber } from "@/utils/decorate";
import { AnyObj } from "@/utils/type";
import { Context } from "koa";

/**
 * 检验分页参数
 * @need { pageNumber, pageSize }
 */
export function check_paging(data: AnyObj) {
  errorSet.clear();

  class Data{

    @isTurnNumber
    @isType('string')
    static pageNumber = data.pageNumber || '1'

    @isTurnNumber
    @isType('string')
    static pageSize   = data.pageSize || '10'

  }

  return (ctx: Context) => {
    const error = [...errorSet][0];
    error && throwError(ctx, 406, error as string);

    return Data;
  }

}
