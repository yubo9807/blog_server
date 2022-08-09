import { randomNum } from "./number";

/**
 * 生成一个随机字符串，充当id用
 */
export function createRandomString() {
  const time = Date.now();
  const num = 100000;
  const random = randomNum(num * 10);
  const str = (BigInt(time * num) + BigInt(random)).toString(32);
  return str.split('').sort(() => Math.random() - .5).join('');
}