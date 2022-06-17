import connection from './connection';

interface AccessParams {
  createTime: number
  url: string
  ip: string 
  forwarded: string
  userAgent: string
  accept: string
  referer: string
  encoding: string
}

/**
 * 添加访问记录
 * @param params 
 * @returns 
 */
export async function sql_addAccessRecord(params: AccessParams) {
  for (const key in params) {
    if (!params[key]) params[key] = null;
    else params[key] = `'${params[key]}'`;
  }
  const { createTime, url, ip, forwarded, userAgent, accept, referer, encoding } = params;
  const connect = await connection();
  const [rows] = await connect.execute(
    `INSERT INTO access (create_time, url, ip, forwarded, userAgent, accept, referer, encoding) 
    VALUES(${createTime}, ${url}, ${ip}, ${forwarded}, ${userAgent}, ${accept}, ${referer}, ${encoding});`,
  );
  connect.end();
  return rows;
}