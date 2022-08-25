import env, { DEVELOPMENT, pathConversion } from './env';
import http from 'http';
import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Router from '@koa/router';
import chalk from 'chalk';
import { notify } from 'node-notifier';

import accessRecord from './middleware/access-record';
import koaStatic from './services/koaStatic';
import routeConfig from './routes';
import bodyDispose from './middleware/body-dispose';
import socket from './socket';
import { getIP4Address } from './utils/inspect';
import proxy from './proxy';

const app = new koa();
const server = http.createServer(app.callback());

// 代理接口
app.use(proxy);

app.use(cors({ origin: env.CORS_ORIGIN }));  // 设置跨域
app.use(bodyParser());  // 接收 body 数据

// 返回数据处理
app.use(bodyDispose);

// webSocket
socket(server);

// 路由配置
const router = new Router();
router.use(env.BASE_API, routeConfig.routes());
app.use(router.routes());

// 静态资源
app.use(koaStatic(pathConversion()));

// 访问记录
app.use(accessRecord);

const ip4 = getIP4Address();
const prot = 20010;
const message = `本地：http://localhost:${prot}${env.BASE_API}\n`
+ 'IP4： ' + (ip4 ? `http://${ip4}:${prot}${env.BASE_API}`: '没连网，铁子！');

server.listen(prot, () => {
	console.log(chalk.blue(message));
	env.NODE_ENV === DEVELOPMENT && notify({
		title: '服务已启动...',
		message,
	});
});
