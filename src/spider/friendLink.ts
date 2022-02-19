import connection from './connection';

// 获取所有友链信息
export async function sql_getFriendLinkList() {
  const connect = await connection();
  const [rows] = await connect.execute(
    `SELECT * FROM friend_link;`
  );
  connect.end();
  return rows;
}

interface FriendLink {
  name: string
  link: string
  remark: string
  create_time: number
}
// 添加友链
export async function sql_addFriendLink(params: FriendLink) {
  const {name, link, remark, create_time} = params;
  const connect = await connection();
  const [rows] = await connect.execute(
    `INSERT INTO friend_link (name, link, remark, create_time)
    VALUES(?, ?, ?, ?);`,
    [name, link, remark, create_time]
  );
  connect.end();
  return rows;
}

// 删除友链
export async function sql_deleteFriendLink(id: number | string) {
  const connect = await connection();
  const [rows] = await connect.execute(
    `DELETE FROM friend_link WHERE id = ?;`,
    [id]
  );
  connect.end();
  return rows;
}

interface ModifyFriendLink {
  id: string | number
  name: string
  link: string
  remark: string
}
// 修改友链信息
export async function sql_modifyFriendLink(params: ModifyFriendLink) {
  const { id, name, link, remark } = params;
  const connect = await connection();
  const [rows] = await connect.execute(
    `UPDATE friend_link
    SET name = ?,
    link = ?,
    remark = ?
    WHERE id = ?;`,
    [name, link, remark, id]
  );
  connect.end();
  return rows;
}