import Router from '@koa/router';
import routeConfig from '@/routes';
import env from "@/env";

const router = new Router();
router.use(env.BASE_API, routeConfig.routes());

/**
 * 中间件：路由
 */
export default router.routes()