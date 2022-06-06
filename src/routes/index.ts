import Router from '@koa/router';
const routes = new Router();

const routerList = [
	{ url: '/user', route: require('./user') },
	{ url: '/role', route: require('./role') },
	{ url: '/menu', route: require('./menu') },
	{ url: '/friendLink', route: require('./friendLink') },
	{ url: '/file', route: require('./file') },
	{ url: '/nozzle', route: require('./nozzle') },
]

routerList.forEach(val => {
	routes.use(val.url, val.route.routes());
})

export default routes;