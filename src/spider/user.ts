import connection from './connection';

// 获取用户列表
export async function sql_getUserList(name = null) {
  const connect = await connection();
  const [rows] = await connect.execute(
    name ? `SELECT id, name, role, remark, create_time, is_receive FROM users WHERE name = ?;`
    : `SELECT id, name, role, remark, create_time, is_receive FROM users;`,
    [name]
  );
  connect.end();
  return rows;
}

// 查询用户信息（含密码）
export async function sql_queryUserData(name: string) {
  const connect = await connection();
  const [rows] = await connect.execute(
    `SELECT * FROM users WHERE name = ? or mail = ?;`,
    [name, name]
  );
  connect.end();
  return rows;
}

interface UserParams {
  name: string
  pass: string
  mail: string | null
  create_time: number
  is_receive: number
}
// 添加用户
export async function sql_addUser(params: UserParams) {
  const { name, pass, mail, create_time, is_receive } = params
  const connect = await connection();
  const [rows] = await connect.execute(
    `INSERT INTO users (name, pass, mail, create_time, is_receive, role)
    VALUES(?, ?, ?, ?, ?, ?);`,
    [name, pass, mail, create_time, is_receive, 'user']
  );
  connect.end();
  return rows;
}