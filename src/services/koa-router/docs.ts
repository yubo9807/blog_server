
type Params = {
  need:     boolean
  type:     'string' | 'number' | 'object' | 'array' | 'boolean'
  default?: any
  remark?:  string
}

/**
 * 参考文档类型检查数据生成模版
 */
export interface Docs {

  author: string
  name:   string

  headers?: {
    [key in string]: {
      need:  boolean
      value: string
    }
  }

  query?: {
    [key in string]: Params
  }

  body?: {
    [key in string]: Params
  }

  data?:   any

}

const docs: Docs = {
  author: 'yangyb',
  name:   'dome',
  query:  {
    a: { need: true, type: 'number', default: 1234 }
  },
  data:   'suesses',
}
