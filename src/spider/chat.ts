import { getNowDate } from '@/utils/date';
import connection from './connection';

/**
 * 获取用户拥有的房间
 * @param username 用户名
 * @returns 
 */
export async function sql_getRoomList(username: string) {
  const connect = await connection();
  const [ roomList ] = await connect.execute(`SELECT room_id FROM connect_user_room WHERE user_name = '${username}';`);
  const roomIdList = [].concat(roomList).map(val => val.room_id);
  const roomIdStr = roomIdList.toString();
  const sql = roomIdStr ? 'OR id IN (' + roomIdStr + ')' : '';
  const [ rooms ] = await connect.execute(`SELECT * FROM rooms WHERE admin = '${username}' ${sql};`);
  connect.end();
  return [].concat(rooms);
}

/**
 * 创建房间
 * @param param
 * @returns 
 */
export async function sql_createRoom({ roomName, admin }) {
  const connect = await connection();
  const [ rows ] = await connect.execute(`INSERT INTO rooms (name, admin, create_time) VALUES(?, ?, ?);`, [ roomName, admin, getNowDate() ]);
  connect.end();
  return rows;
}
/**
 * 查找房间Id
 * @param param
 * @returns 
 */
export async function sql_queryRoomId({ roomName, admin }) {
  const connect = await connection();
  const [ rows ] = await connect.execute(`SELECT id FROM rooms WHERE name = ? AND admin = ?;`, [ roomName, admin ]);
  connect.end();
  return rows[0].id;
}


/**
 * 加入房间
 * @param param
 * @returns
 */
export async function sql_jionRoom(roomId: string | number, names: string[]) {
  let sql = '';
  names.forEach(val => sql += `(${roomId}, '${val}', ${getNowDate()}),`);
  const connect = await connection();
  const [ rows ] = await connect.execute(`INSERT INTO connect_user_room (room_id, user_name, create_time) VALUES ${sql.slice(0, -1)};`);
  connect.end();
  return rows;
}

/**
 * 退出房间
 * @param param
 * @returns 
 */
export async function sql_outRoom({ userName, roomId }) {
  const connect = await connection();
  const [ idList ] = await connect.execute(`SELECT id FROM connect_user_room WHERE user_name = ? AND room_id = ?;`, [ userName, roomId ]);
  const [ rows ] = await connect.execute(`DELETE FROM connect_user_room WHERE id IN (${[].concat(idList).join(',')});`);
  connect.end();
  return rows;
}

/**
 * 删除房间
 * @param roomId 房间 id
 * @returns 
 */
export async function sql_deleteRoom(roomId) {
  const connect = await connection();
  await connect.execute(`DELETE FROM rooms WHERE id = ?;`, [ roomId ]);
  await connect.execute(`DELETE FROM connect_user_room WHERE room_id = ?;`, [ roomId ]);
  connect.end();
  return;
}