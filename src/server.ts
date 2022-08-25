import env, { DEVELOPMENT, pathConversion } from './env';
import http from 'http';
import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import chalk from 'chalk';
import { notify } from 'node-notifier';

import koaStatic from './services/koa-static';
import proxy from './proxy';
import socket from './socket';
import accessRecord from './middleware/access-record';
import bodyDispose from './middleware/body-dispose';
import router from './middleware/router';
import preventDataRefresh from './middleware/prevent-data-refresh';
import { getIP4Address } from './utils/inspect';

const app = new koa();
const server = http.createServer(app.callback());

app.use(preventDataRefresh);

app.use(cors({ origin: env.CORS_ORIGIN }));  // 设置跨域
app.use(bodyParser());  // 接收 body 数据

app.use(proxy);

app.use(router);
app.use(bodyDispose);

socket(server);

app.use(koaStatic(pathConversion()));

app.use(accessRecord);


const ip4 = getIP4Address();
const prot = 20010;
const message = `本地：http://localhost:${prot}${env.BASE_API}\n`
+ 'IP4： ' + (ip4 ? `http://${ip4}:${prot}${env.BASE_API}`: '没连网，铁子！');

// 监听端口
server.listen(prot, () => {
	console.log(chalk.blue(message));
	env.NODE_ENV === DEVELOPMENT && notify({
		title: '服务已启动...',
		message,
	});
});
