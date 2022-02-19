import Router from '@koa/router';
import { sql_getFriendLinkList, sql_addFriendLink, sql_deleteFriendLink, sql_modifyFriendLink } from '../../spider/friendLink';
import { errorDealWith } from '../../services/errorDealWith';
const friendLink = new Router();
import { choke } from '@/utils/optimize'

// 获取友链列表
friendLink.get('/', async(ctx, next) => {
  // choke(5000);  // 程序阻塞5秒
  ctx.body = await sql_getFriendLinkList();
  next();
})

// 删除友链
friendLink.delete('/', async(ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    errorDealWith(ctx, 406, 'params error');
  }
  ctx.body = await sql_deleteFriendLink(id);
  next();
})

// 添加友链
friendLink.post('/', async(ctx, next) => {
  const { name, link, remark } = ctx.request.body;
  if (!name || !link) {
    errorDealWith(ctx, 406, 'params error');
  }
  await sql_addFriendLink({ name, link, remark, create_time: Date.now() })
  ctx.body = 'add to success';
  next();
})

// 修改友链
friendLink.put('/', async(ctx, next) => {
  const { id, name, link, remark } = ctx.request.body;
  const params = {
    id,
    name,
    link,
    remark
  }
  ctx.body = await sql_modifyFriendLink(params);
  next();
})

export = friendLink;
