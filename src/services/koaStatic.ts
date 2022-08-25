import fs from "fs";
import path from "path";
import { getType } from "mime";

// 用于获取文件路径
async function getFileName(urlPath: string, root: string): Promise<any> {

    const subPath = urlPath.substr(1);
    const filename = path.resolve(root, subPath);
    try {
        const stat = await fs.promises.stat(filename);
        if (stat.isDirectory()) {
            // 是目录
            const newUrlPath = path.join(urlPath, "index.html");
            return await getFileName(newUrlPath, root);
        } else {
            return filename;
        }
    } catch {
        return null;
    }
}

export default function (root: string) {
    return async function (ctx: any, next: () => {}) {
        if (ctx.method !== "GET") {
            next();
            return;
        }
        const filename = await getFileName(ctx.path, root);
        if (!filename) {
            // 文件不存在
            next();
            return;
        }
        // 得到文件内容
        ctx.body = fs.createReadStream(filename);
        ctx.type = getType(filename);
        next();
    };
};