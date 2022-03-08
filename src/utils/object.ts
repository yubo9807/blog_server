
/**
 * 对象是否为空
 * @param obj 
 * @returns 
 */
export function isEmptyObject(obj = {}) {
  if (Object.keys(obj).length === 0) return true;
  else return false;
}