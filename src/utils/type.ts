
// 任意类型对象
export type AnyObj = {
  [prop: string | number | symbol]: any
}

export type Type = 'string'    | 'number'  | 'boolean' |
                   'symbol'    | 'bigint'  |
                   'undefined' | 'null'    |
                   'array'     | 'object'  |
                   'function'  | 'promise' |
                   'set'       | 'map'     |
                   'weakset'   | 'weakmap' | 'weakref'

export function isType(o: any): Type {
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}