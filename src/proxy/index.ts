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

export default proxy(options);