import File from '../../services/readFile';
import fs from 'fs';
import path from 'path';

let number = 0;
/**
 * 搜索相关内容文件
 * @param {*} fileSrc 搜索文件地址
 * @param {*} text 搜索内容
 * @param {*} arr 
 * @param {*} maxSearch 最大搜索条数
 */
export const fileContentSearch = async function fileContentSearch (fileSrc: string, text: string, arr: object[] = []) {
    const file = new File(fileSrc);
    const fileList = await file.getChildren();

    // if (number > 10) return arr;
    for (let i = 0; i < fileList.length; i ++) {
        const { isFile, ext, name, filename } = await File.getFile(fileList[i].filename);
        if (isFile) {  // 是文件，读取内容
            const data = await readFile(filename);
            if (data.includes(text)) {
                const src = path.relative(path.resolve(__dirname, './md/*'), filename);
                const srcArr = src.match(/\s.+(\.md)$/);
                let newSrc: any;
                if (srcArr) {
                    number ++;
                    newSrc = srcArr[0].slice(1, -3);
                }
                // obj[newSrc] = data;
                // arr.unshift(obj);
                arr.push(newSrc)
            }
        } else {  // 是文件夹，递归向下读取
            await fileContentSearch(filename, text, arr);
        }
    }
    return arr;
}

async function readFile (filename: string) {
    return await fs.promises.readFile(filename, 'utf-8');
}