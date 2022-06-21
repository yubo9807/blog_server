export function getNowDate(timestamp: Date | number = Date.now()) {
  return parseInt(String(new Date(timestamp).getTime() / 1000));
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
 export const dateFormater = (formater: string = 'YYYY-MM-DD hh:mm:ss', t: string | number | Date = new Date()) => {
  const {year, month, day, hour, minute, second} = getCurrentDate(t);
  return formater.replace(/YYYY/g, year)
  .replace(/YY/g, year.substr(2, 2))
  .replace(/MM/g, (month < 10 ? '0' : '') + month)
  .replace(/DD/g, (day < 10 ? '0' : '') + day)
  .replace(/hh/g, (hour < 10 ? '0' : '') + hour)
  .replace(/mm/g, (minute < 10 ? '0' : '') + minute)
  .replace(/ss/g, (second < 10 ? '0' : '') + second);
}

const addZero = (v: string | number) => v < 10 ? '0' + v : v;
/**
 * 格林时间转为北京时间
 * @param {*} time 
 */
export function switchTimeFormat (time: Date | string) {
    const dateTime = new Date(time);
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const date = dateTime.getDate();
    const hour = dateTime.getHours();
    const minute = dateTime.getMinutes();
    const second = dateTime.getSeconds();
    return `${year}-${addZero(month)}-${addZero(date)} ${addZero(hour)}:${addZero(minute)}:${addZero(second)}`;
}


/**
 * 获取当月的天数
 * @param time 格式：2022-5
 */
export function getMonthDays(time: string | null = null) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const d = new Date(year, month, 0);
  return d.getDate();
}
