import Router from '@koa/router';
import env, { pathConversion } from '@/env';
import koaBody from 'koa-body';
import { errorDealWith } from '@/services/errorDealWith';
import { sql_setUserInfo } from '@/spider/user';
import { verifyJwt } from '@/services/jwt';
import { Context } from 'koa';
import { randomNum } from '@/utils/number';

const file = new Router();

function checkUser(ctx: Context) {
  const { authorization } = ctx.headers;
  return verifyJwt(authorization);
}

// 上传头像
file.post('/portrait',

  koaBody({
    multipart: true,  // 支持文件格式
    formidable: {
      maxFileSize: 1024 * 300,  // 文件大小最大限制
      uploadDir: pathConversion('/imgs/portrait'),  // 上传目录
      keepExtensions: true,  // 保留文件扩展名
      onFileBegin: (formname, file) => {
        const ext = file.name.split('.').pop();
        const filename = Date.now() + randomNum(100000);
        // 修改上传文件路径
        file.path = pathConversion(`/imgs/portrait/${filename}.${ext}`);
      },
    },
    onError: (error, ctx) => {
      errorDealWith(ctx, 500, error.message);
    }
  }),

  async(ctx, next) => {
    const { id } = checkUser(ctx);
    const fileList = [];
    const formData = ctx.request.files;
    for (const prop in formData) {
      const { name, path, type, size } = (formData[prop] as any);
      const newPath = path.replace(env.BASE_PUBLIC, '');
      fileList.push({ name, path: newPath, type, size });
      await sql_setUserInfo(id, {'portrait': newPath });
    }

    ctx.body = fileList;
    next();
  }

)

export = file;
