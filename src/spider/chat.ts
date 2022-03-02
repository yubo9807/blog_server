import connection from './connection';

// 获取用户拥有的房间
export async function sql_getRoomList(username: string) {
  const connect = await connection();
  const [ roomIdList ] = await connect.execute(`SELECT room_id FROM chat WHERE user_name = ?;`, [ username ]);
  const sqlStr = roomIdList.toString();
  const [ rooms ] = await connect.execute(`SELECT * FROM rooms WHERE user = '${username}' ${sqlStr ? 'OR id IN (' + sqlStr + ');' : ';'}`);
  connect.end();
  return [].concat(rooms);
}
