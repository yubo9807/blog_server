import Router from '@koa/router';
import env, { pathConversion } from '@/env';
import koaBody from 'koa-body';
import { throwError } from '@/services/errorDealWith';
import { sql_queryUserData, sql_setUserInfo } from '@/spider/user';
import { randomNum } from '@/utils/number';
import { getAuthorization } from '@/services/authorization';
import fs from 'fs';

const upload = new Router();

// #region 上传头像
upload.post('/portrait',

  koaBody({
    multipart: true,  // 支持文件格式
    formidable: {
      maxFileSize: 1024 * 300,  // 文件大小最大限制
      uploadDir: pathConversion('/imgs/portrait'),  // 上传目录
      keepExtensions: true,  // 保留文件扩展名
      onFileBegin: (formname, file) => {
        const ext = file.name.split('.').pop();
        const filename = '' + Date.now() + randomNum(100000);
        // 修改上传文件路径
        file.path = pathConversion(`/imgs/portrait/${filename}.${ext}`);
      },
    },
    onError: (error, ctx) => {
      throwError(ctx, 500, error.message);
    }
  }),

  async(ctx, next) => {
    const { id, name } = await getAuthorization(ctx);
    const users = await sql_queryUserData(name);
    
    if (users[0].portrait) {
      const oldPath = pathConversion(users[0].portrait);
      fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
    }
    
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
// #endregion

export = upload;
