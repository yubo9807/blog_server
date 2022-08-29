import { getNowDate } from '@/utils/date';
import connection from './connection';

/**
 * 加入到黑名单
 * @param ip ip地址
 * @param requestNumber 请求次数
 * @returns 
 */
export async function sql_addBlockList(ip: string, requestNumber: number = 0) {
  const createTime = getNowDate();
  const connect = await connection();
  const [ rows ] = await connect.execute(`INSERT INTO blacklist (ip, create_time, request_number) VALUES(?, ?, ?);`, [ ip, createTime, requestNumber ]);
  connect.end();
  return rows;
}

/**
 * 查找黑名单列表
 * @param ip 查询ip
 * @returns 
 */
export async function sql_queryBlockList(ip: string | null = null) {
  const connect = await connection();
  const [ rows ] = await connect.execute(ip ? `SELECT * FROM blacklist WHERE ip = '${ip}';` : `SELECT * FROM blacklist;`);
  connect.end();
  return rows;
}

/**
 * 删除黑名单列表ip
 * @param id 查询ip
 * @returns 
 */
export async function sql_deleteBlockList(id: string) {
  const connect = await connection();
  const [ rows ] = await connect.execute(`DELETE FROM blacklist WHERE id = '${id}';`);
  connect.end();
  return rows;
}