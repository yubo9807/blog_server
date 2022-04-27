/**
 * 请求函数封装
 * @param promise
 * @param errorExt 错误消息
 * @returns 
 */
export function asyncto(promise: Promise<any>, errorExt: string = '') {
  return promise
    .then(data => [ null, data ])
    .catch(err => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [ parsedError, undefined ];
      }
      return [ err, undefined ];
    })
}