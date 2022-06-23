import Router from '@koa/router';
const route = new Router();
import File from '@/utils/file';
import env, { pathConversion } from '@/env';
import { dateFormater, getNowDate } from '@/utils/date';
import fs from 'fs';


route.get('/sitemap', async(ctx, next) => {
  const file = new File();
  const createTime = dateFormater('YYYY-MM-DDThh:mm:ssZ', getNowDate() * 1000)

  async function createSiteMapXml(filename: string, arr = []) {
    const fileList = await file.getChildren(filename);
    
    for await (const attr of fileList) {
      if (attr.isFile) {
        const str = 'http://hpyyb.cn' + attr.filename.replace(env.BASE_PUBLIC, '').replace(/&/g, '&amp;');
        arr.push(`<sitemap>
  <loc>${str}</loc>
  <lastmod>${createTime}</lastmod>
</sitemap>`);
      } else {
        await createSiteMapXml(attr.filename, arr);
      }
    }
  
    return arr;
  }

  const xmls = await createSiteMapXml(pathConversion('/note'));
  const xmlStr = `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${xmls.join('\n')}
</sitemapindex>`;
  
  fs.writeFileSync(pathConversion('/sitemap.xml'), xmlStr);

  ctx.body = 'success';
  next();
})


export = route;
