import Router from '@koa/router';
const memory = new Router();

const routerList = [
	{ url: '/redis', route: require('./redis') },
]

routerList.forEach(val => {
	memory.use(val.url, val.route.routes());
});

export = memory;
