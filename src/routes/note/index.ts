import fs from 'fs';
import { pathConversion } from '../../env';
import { getFolderList } from './getfileList';
import { fileContentSearch } from './fileSearch';
import redis from '../../services/redis';
import Router from '@koa/router';
const note = new Router();
const OVERTIME = 1000 * 60 * 5;  // 数据缓存时间

// 获取笔记文件内容
note.get('/getfile', async(ctx, next) => {
	const { url }: any = ctx.query;
	const len = url.split('/').length;
	if (url.split('/')[len - 1] === 'undefined') {
		ctx.state.code = 500;
		ctx.state.msg = "param 'url' is empty";
		next();
	} else {
		let text = '';
		try {
			text = await redis.deposit(ctx, async () => {
				const src = pathConversion(`/note/${unescape(url)}`);
				return await fs.promises.readFile(src, 'utf-8');
			}, OVERTIME)
		} catch {
			ctx.state.code = 406;
			ctx.state.msg = "param 'url' corresponding file not found";
		}
		ctx.body = text;
		next();
	}
})

// 获取笔记列表
note.get('/label', async(ctx, next) => {
	const data = await redis.deposit(ctx, async () => {
		return await getFolderList(pathConversion('/note'));
	}, OVERTIME)
	ctx.body = data;
	next();
})

export = note;