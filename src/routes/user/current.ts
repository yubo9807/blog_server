import { Context } from "koa";
import { throwError } from "../../services/errorDealWith";
import { sql_getUserList, sql_queryUserData } from "../../spider/user";
import { getAuthorization } from '@/services/authorization';
import redis from "@/services/redis";
import { signInUsersKey } from "./signIn";

export default async(ctx: Context, next: Function) => {
  const user = await getAuthorization(ctx);

  const { name } = user;

  if (!name) {
    throwError(ctx, 500, '没有该用户信息');
  }


  let userData = {}
  const userList = await redis.deposit(signInUsersKey, async () => {
    return await redis.deposit(signInUsersKey) || [];
  });
  const index = userList.findIndex(val => val.name === name);

  // 先看缓存中有没有；缓存中没有存过该用户信息，查数据库
  if (index >= 0) {
    userData = userList[index];
  } else {
    const row = (await sql_queryUserData(name))[0];
    const { pass, ...args } = row;
    userData = args;
  }


  if (!userData) {
    throwError(ctx, 500, '用户不存在');
  }


  // 防止 服务器重启的情况下，缓存数据会丢失
  redis.deposit(signInUsersKey, async () => {
    const list = await redis.deposit(signInUsersKey) || [];
    const index = list.findIndex(val => val.name === name);
    index < 0 && list.push(userData);
    return list;
  }, -1, true);


  ctx.body = userData;
  next();
}
