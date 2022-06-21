
/**
 * 检测属于什么类型
 * @param o
 */
 export const isType = (o: any) => Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
