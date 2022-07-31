import path from 'path';
import moduleAlias from 'module-alias';

export const DEVELOPMENT = 'development';
export const PRODUCTION  = 'production';

const BASEAPI = '/api';

// 生产环境
let env = {

  NODE_ENV: process.env.NODE_ENV || PRODUCTION,

  BASE_PUBLIC: path.resolve(__dirname, '../../public'),  // 静态资源目录

  BASE_ROOT: path.resolve(__dirname, '../'),  // 根目录

  BASE_URL: path.resolve(__dirname),

  BASE_API: BASEAPI,

  BASE_SOCKET: BASEAPI + '/socket',

  CORS_ORIGIN: 'http://hpyyb.cn/',  // 允许访问IP

}

// 开发环境
if (env.NODE_ENV === DEVELOPMENT) {
  Object.assign(env, {

    CORS_ORIGIN: '*'

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
