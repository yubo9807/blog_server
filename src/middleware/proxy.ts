import proxy from 'koa2-proxy-middleware';

const options = {
	targets: {
		'/api/yapi/(.*)': {
			target: 'http://yapi.boyachain.cn',
			changeOrigin: true,
      pathRewrite: {
        '^/api/yapi': '/api'
      }
		},
	}
};

/**
 * 中间件：接口代理
 */
export default proxy(options);