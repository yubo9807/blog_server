import Router from '@koa/router';
import { sql_appMenuList, sql_deleteMenuList, sql_getMenuList, sql_modifyMenuConfig, sql_modifyMenuList, sql_replaceMenuOrder } from '@/spider/menu';
import { errorDealWith } from '@/services/errorDealWith';
const menu = new Router();

// 获取所有菜单
menu.get('/list', async(ctx, next) => {
  ctx.body = await sql_getMenuList();
  next();
})

// 初始化菜单
menu.post('/init', async(ctx, next) => {
  const { addMenuList, modifyMenuList, deleteMenuList } = ctx.request.body;

  addMenuList.length > 0 && await sql_appMenuList(addMenuList);
  deleteMenuList.length > 0 && await sql_deleteMenuList(deleteMenuList);
  modifyMenuList.length > 0 && await sql_modifyMenuList(modifyMenuList);
  
  ctx.body = 'success';
  next();
})

// 修改排序
menu.put('/order', async(ctx, next) => {
  const { replaceArr } = ctx.request.body;
  if (replaceArr instanceof Array && replaceArr.length === 2) {
    await sql_replaceMenuOrder(replaceArr[0], replaceArr[1]);
  } else {
    errorDealWith(ctx, 406);
  }
  
  ctx.body = 'success';
  next();
   
})

menu.put('/config', async(ctx, next) => {
  const { id, config } = ctx.request.body;

  if (config instanceof Object && id) {
    await sql_modifyMenuConfig(id, config);
    ctx.body = 'success';
    next();
  }

  errorDealWith(ctx, 406);

})

export = menu;