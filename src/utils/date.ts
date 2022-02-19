export function getNowDate() {
  return parseInt(String(Date.now() / 1000));
}

/**
 * 获取当前时间
 * @param t 
 */
 export const getCurrentDate = (t: string | number | Date) => {
  let date = t ? new Date(t) : new Date();
  return {
      year: date.getFullYear() + '',
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
  }
}

/**
 * 格式化时间
 * @param formater 
 * @param t 
 */
 export const dateFormater = (formater: string = 'YYYY-MM-DD hh:mm:ss', t: string | Date = new Date()) => {
  const {year, month, day, hour, minute, second} = getCurrentDate(t);
  return formater.replace(/YYYY/g, year)
  .replace(/YY/g, year.substr(2, 2))
  .replace(/MM/g, (month < 10 ? '0' : '') + month)
  .replace(/DD/g, (day < 10 ? '0' : '') + day)
  .replace(/hh/g, (hour < 10 ? '0' : '') + hour)
  .replace(/mm/g, (minute < 10 ? '0' : '') + minute)
  .replace(/ss/g, (second < 10 ? '0' : '') + second);
}