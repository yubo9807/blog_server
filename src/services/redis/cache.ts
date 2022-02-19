import { createNum } from '@/utils/number';

// 私有属性，禁止导出
const length = Symbol('_length');
const data = Symbol('data');

export type Key = string | symbol
export type Value = any
export type OverTime = any
export type Count = number

const iter = createNum();

const cache = {
  // 将 data 设置为 Symbol 类型，避免直接查看/添加/删除/修改属性
  [data]: {
    [length]: 0
  },

  /**
   * 设置缓存数据
   * @param {string | symbol} key 如果不想覆盖此属性，请将 key 设置为 Symbol 类型
   * @param {*} value 
   * @param {number} overTime 过期时间，单位（ms）
   */
  set(key: Key, value: Value, overTime: OverTime) {
    if (key === null || key === undefined || key === '') return;
    this[data][length] ++;
    this[data][key] = {
      createTime: Date.now(),
      value,
      overTime: overTime,
      count: iter.next().value,  // 同一毫秒内可能存很多数据，记录一个索引，越小则证明存放时间越早
    }
  },

  /**
   * 获取数据
   * @param key 给我一个 key 值
   * @returns 
   */
  get(key: Key) {
    if (this[data][key] == null) return;

    const time = Date.now();
    const obj = this[data][key];
    time - obj.createTime > obj.overTime && this.delete(key);
    return this[data][key]?.value;  // ?. 防止存放 value === undefined 报错
  },

  // 删除数据
  delete(key: Key) {
    if (!this[data][key]) return;
    delete this[data][key];
    this[data][length] --;
  },

  // 清空所有数据
  clear() {
    this[data] = {}
  },

  // data.length
  length() {
    return this[data][length];
  },

  // 获取所有缓存数据
  gainAll() {
    return this[data];
  },
  // 获取数据字节大小，粗略计算（没有区分汉字与英文及 symbol 类型的 key.length）
  size() {
    return getLSUsedSpace(this[data]);
  }
}

/**
 * 获取一个对象的字节大小
 * @param obj 
 * @returns 
 */
export function getLSUsedSpace(obj: any) {
  return Object.keys(obj).reduce((total, curKey) => {
    if (!obj.hasOwnProperty(curKey)) {
      return total;
    }
    if (typeof obj[curKey] === 'string') {
      total += obj[curKey].length + curKey.length;
    } else {
      total += JSON.stringify(obj[curKey]).replace(/"/g, '').length + curKey.length;
    }
    return total;
  }, 0);
}

export default cache;
