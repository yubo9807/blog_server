import cache, { Key, Value, OverTime, Count } from './cache';

type CreateTime = number
export type Cover = boolean
type ItemObj = {
  createTime: CreateTime,
  value: Value,
  overTime: OverTime,
  count: Count
}
type SortArr = {
  key: Key,
  createTime: CreateTime,
  value: Value,
  overTime: OverTime,
  count: Count
}

export default class Redis {
  maxCache: number
  constructor(maxCache = 1024 * 1024 * 2) {
    this.maxCache = maxCache;  // 最大缓存数
  }
  
  /**
   * 储存数据，如果已经存在并且没有过期你会直接获取到该数据
   * @param {string} key 设置存放数据的键
   * @param {*} value 是一个函数时(必须返回数据)：可以进行数据请求，有缓存时并不会执行；其他类型：直接将数据存放进去
   * @param {date} overTime 过期时间，为 -1 时数据不过期。设置更小的数无意义
   * @param {boolean} cover 强制覆盖数据
   * @returns 返回设置的 value
   */
  async deposit(key: Key, value?: Value, overTime: OverTime = -1, cover: Cover = false) {
    if (overTime === -1) overTime = Infinity;  // 设置过期时间正无穷，使数据永久不会过期

    if (cover) {
      typeof value === 'function' ? value = await value() : value;
      cache.set(key, value, overTime);
      return cache.get(key);
    }
    
    const data = cache.get(key)
    if (data) {
      return { cache: true, data };
    } else {
      typeof value === 'function' ? value = await value() : value;
      cache.set(key, value, overTime);  // 先存数据后清内存，防止溢出
      
      const size = cache.size();  // 获取容器已存放数据内存大小
      // 实际缓存的数据比设置缓存数大，进行数据清理
      size > this.maxCache && this.clearCache();
      
      return { cache: false, data: value };
    }
  }

  // 清除数据（过期的，早以前的）
  clearCache() {
    this.deleteOverValue();  // 清除已过期数据
    const size = cache.size();

    if (size < this.maxCache) return;  // 再判断一次内存大小
    
    const obj: ItemObj[] = cache.gainAll();
    const arr: SortArr[] = [];
    for (const prop of Object.entries(obj)) {
      if (prop[1].overTime === Infinity) continue;  // 跳过设置不过期数据
      arr.push({key: prop[0], ...prop[1]});
    }
    const newArr = choiceSort(arr);
    this.deleteFristValue(newArr);
  }
  
  // 删除过期的数据
  deleteOverValue() {
    const obj: ItemObj[]  = cache.gainAll();
    const curTime = Date.now();
    for (const prop of Object.entries(obj)) {
      const createTime = prop[1].createTime;
      const overTime = prop[1].overTime;
      if (curTime - createTime > overTime) {
        cache.delete(prop[0]);
      }
    }
  }

  // 删除最早缓存的数据
  deleteFristValue(arr: SortArr[]) {
    const key = arr[0].key;
    arr.shift();
    cache.delete(key);

    const size = cache.size();
    if (size <= this.maxCache) return;
    this.deleteFristValue(arr);  // 如果容器内存依然大于设定内存，继续删
  }

}

/**
 * 数据排序算法
 * @param arr 
 * @returns 
 */
function choiceSort(arr: SortArr[]) {
  const len = arr.length;
  if (arr == null || len === 0) return [];
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1; j++) {
      const minValue = arr[j];
      if (minValue.count > arr[j + 1].count) {
        [arr[j], arr[j + 1]] = [arr[j + 1], minValue];  // 调换位置
      }
    }
  }
  return arr;
}
