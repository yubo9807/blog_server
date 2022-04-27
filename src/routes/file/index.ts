import Router from '@koa/router';
const file = new Router();

const routerList = [
	{ url: '/upload', route: require('./upload') },
	{ url: '/read', route: require('./read') },
	{ url: '/search', route: require('./search') },
]

routerList.forEach(val => {
	file.use(val.url, val.route.routes());
})

export = file;
