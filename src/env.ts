import path from 'path';
import moduleAlias from 'module-alias';

const base_api = '/api';

// 开发环境
let env = {

  NODE_ENV: process.env.NODE_ENV,

  BASE_PUBLIC: path.resolve(__dirname, '../public'),  // 静态资源目录

  BASE_ROOT: path.resolve(__dirname, '../'),  // 根目录

  BASE_URL: path.resolve(__dirname),

  BASE_API: base_api,

  BASE_SOCKET: base_api + '/socket',

  CORS_ORIGIN: '*',  // 允许访问IP

}

// 生产环境
if (env.NODE_ENV !== 'development') {
  Object.assign(env, {

    CORS_ORIGIN: 'http:hpyyb.cn/'

  })
}

moduleAlias.addAliases({
  '@': env.BASE_URL,
  '~': env.BASE_ROOT
})

export default env;

// 拼接静态资源目录
export function pathConversion(url: string = '') {
  return env.BASE_PUBLIC + url.replace(/\//g, path.sep);
}
