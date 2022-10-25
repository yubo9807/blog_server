import { AnyObj, isType as inspectType, Type } from './type';

export type Constructor = new () => object
type Key = string | number | symbol
export const errorSet = new Set();

/**
 * @description: 数据校验不通过，打印错误信息（类装饰器）
 * @param {any} data 要校验的数据
 * @returns
 */
export function dataCheck(data: any) {
  return (target: Constructor) => {
    // if (errorSet.size > 0) {
    //   console.log('数据校验: 原数据 >> ', data);
    //   console.table(Array.from(errorSet));
    // }
  }
}

// 值是否为空
export function isNotEmpty(target: Constructor, key: Key) {
  const value = target[key];
  if (['', undefined, null].includes(value)) {
    errorSet.add(`${key.toString()} 不能为空`);
  }
}

/**
 * @description: 类型校验
 * @param {string} type 实际类型
 * @returns
 */
export function isType(type: Type) {
  return (target: Constructor, key: Key) => {
    const targetType = inspectType(target[key]);
    if (targetType !== type) {
      errorSet.add(`${key.toString()} 类型应为 ${type}，实际收到类型为 ${targetType}`);
    }
  }
}

export function isTurnNumber(target: Constructor, key: Key) {
  const value = target[key];
  if (isNaN(value)) {
    errorSet.add(`${key.toString()}: ${value} 不是一个数`);
  }
}

/**
 * @description: 校验数值范围
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns
 */
export function dataLength(min = 5, max = 10) {
  return (target: Constructor, key: Key) => {
    const value = target[key];
    if (value.length <= min || value.length > max) {
      errorSet.add(`${key.toString()} 长度应为 ${min}～${max}，实际长度为 ${value.length}`);
    }
  }
}

/**
 * 校验正则
 * @param reg 
 * @returns
 */
export function regExp(reg: RegExp) {
  return (target: Constructor, key: Key) => {
    const value = target[key];
    if (!reg.test(value)) {
      errorSet.add(`${reg} 校验未通过`);
    }
  }
}