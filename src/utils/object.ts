import { AnyObj } from "./type";

/**
 * 对象是否为空
 * @param obj 
 * @returns 
 */
export function isEmptyObject(obj = {}) {
  if (Object.keys(obj).length === 0) return true;
  else return false;
}

/**
 * 删除对象中的空值
 * @param obj
 * @param option 过滤哪些值
 */
export function deleteEmpty(obj: AnyObj, option = [null, undefined, '']) {
  const newObj = {}
  for (const prop in obj) {
    if (!option.includes(obj[prop])) {
      newObj[prop] = obj[prop]
    }
  }
  return newObj
}