import fs from 'fs';
import path from 'path';

export default class File {
    filename: string;
    name?: string;
    ext?: string;
    isFile?: boolean;
    size?: number;
    createTime?: Date;
    updataTime?: Date;
    constructor (filename: string, name?: string, ext?: string, isFile?: boolean, size?: number, createTime?: Date, updataTime?: Date) {
        this.filename = filename;
        this.name = name;
        this.ext = ext;
        this.isFile = isFile;
        this.size = size;
        this.createTime = createTime;
        this.updataTime = updataTime;
    }

    // 获取文件内容
    async getContent (isBuffer = false) {
        if (this.isFile) {
            if (isBuffer) {
                return await fs.promises.readFile(this.filename);
            } else {
                return await fs.promises.readFile(this.filename, 'utf-8');
            }
        } else {
            return null;
        }
    }

    // 获取文件夹下的文件所有属性，返回一个数组
    async getChildren () {
        if (this.isFile) {
            return [];
        }
        let children: any[] = await fs.promises.readdir(this.filename);
        children = children.map((name: string) => {
            const result = path.resolve(this.filename, name);
            return File.getFile(result);
        });
        return Promise.all(children);
    }
    
    // 获取文件属性
    static async getFile(filename: string) {
        const stat = await fs.promises.stat(filename);  // 文件路径
        const name = path.basename(filename);  // 文件名
        const ext = path.extname(filename);  // 文件后缀
        const isFile = stat.isFile();  // 是否为文件
        const size = stat.size;
        const createTime = stat.birthtime;
        const updataTime = stat.mtime;

        return new File(filename, name, ext, isFile, size, createTime, updataTime);
    }

    async readDir (dirname: string) {
        const file = await File.getFile(dirname);
        return await file.getChildren();
    }
}
