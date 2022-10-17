import env from "@/env";
import File from "@/utils/file";
import { asyncto } from "@/utils/network";
import { marked } from "marked";

const file = new File();

/**
 * 获取文件内容或子目录
 * @param filename    文件路径
 * @param replacePath 替换路径字符
 * @returns 
 */
export async function getFileContentOrChildDirectory(filename: string, replacePath = '') {
  let body: any;
  
  const fileAttr: any = await File.getStat(filename);
  
  if (fileAttr.isFile) {
    fileAttr.path = fileAttr.filename.replace(replacePath, '');

    // 是文件，返回文件内容
    let content = await file.getContent(filename);
    fileAttr.ext === '.md' && (content = marked.parse(content));
    body = { ...fileAttr, content };

  } else {

    // 不是文件返回子目录
    const file = new File();
    const arr = await file.getChildren(filename);
    arr.forEach(val => {
      val.path = val.filename.replace(replacePath, '');
    });

    // 排序
    arr.sort((a: any, b: any) => {
      const beginWith = /^\d/;
      if (beginWith.test(a.name) && beginWith.test(b.name)) return parseInt(a.name) - parseInt(b.name);
      else return new Intl.Collator('en').compare(a.name, b.name);
    });

    body = arr;

  }
  
  return body;
}


/**
 * 搜索文件中包含的字符
 * @param filename 文件路径
 * @param text     搜索文字
 * @param arr      无需传递，递归用
 * @returns 
 */
export async function searchFile(filename: string, text: string, arr = []) {
  if (!text) return [];
  const children = await file.getChildren(filename);
  for await (const prop of children) {
    if (!prop.isFile) {
      await searchFile(prop.filename, text, arr);
    }
    const [ error, content ] = await asyncto(file.getContent(prop.filename));
    if (!error && content.includes(text)) {
      prop.path = prop.filename.replace(env.BASE_PUBLIC, '');
      const startIndex = content.search(text);
      prop.content = content.slice(startIndex, startIndex + 120);
      arr.push(prop);
    }
  }
  return arr;
}