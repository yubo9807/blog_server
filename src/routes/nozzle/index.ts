import Router from '@koa/router';
import axios from 'axios';
const nozzle = new Router();

// 获取所有角色
nozzle.get('/', async(ctx, next) => {
  const data = await axios({
    url: 'http://localhost:20010/api/yapi/interface/list?page=1&limit=20&project_id=377',
    method: 'get',
  })
  ctx.body = data;
  next();
})

export = nozzle;
