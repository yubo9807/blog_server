import fs from 'fs';
import path from 'path';
import { asyncto } from './network';
import { getNowDate } from './date';

export default class File {

  exclude: string[]
  constructor(exclude = ['.DS_Store', '.git']) {
    this.exclude = exclude;  // 排除访问文件或文件夹
  }
  


  /**
   * 获取文件属性
   */
  static async getStat(filename: string) {
    const [ err, stat ] = await asyncto(fs.promises.stat(filename));
    if (err) return Promise.reject(err);

    return Promise.resolve({
      filename,
      isFile: stat.isFile(),  // 是否为文件
      size: stat.size,
      createTime: getNowDate(stat.birthtime),
      updataTime: getNowDate(stat.mtime),
      name: path.basename(filename),  // 文件名
		  ext: path.extname(filename),  // 文件后缀
    })
  }




  /**
   * 获取文件内容
   * @param filename 
   * @param isBuffer 是否以 buffer 格式返回
   */
  async getContent(filename: string, isBuffer = false) {
    const { isFile, name } = await File.getStat(filename);
    if (this.exclude.includes(name) || !isFile) return Promise.reject(`${name} is not a file`);

    let fileContent = null;
    isBuffer
      ? fileContent = await fs.promises.readFile(filename)
      : fileContent = await fs.promises.readFile(filename, 'utf8');

    return Promise.resolve(fileContent);
  }



  /**
   * 获取文件夹子目录下的文件属性
   * @param filename 
   * @param exclude 排除文件或文件夹
   */
  async getChildren(filename: string) {
    const [ error, children] = await asyncto(fs.promises.readdir(filename));
    if (error) return Promise.reject(error);

    const arr = [];
    children.forEach(name => {
      if (this.exclude.includes(name)) return;
      const result = path.resolve(filename, name);
      arr.push(File.getStat(result));
    })
    return Promise.all(arr);
  }



}
