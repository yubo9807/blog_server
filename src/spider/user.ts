import connection from './connection';

/**
 * 获取用户列表
 * @param name 用户名，不传递则查所有所有列表
 * @returns 
 */
export async function sql_getUserList(name = null) {
  const connect = await connection();
  const [rows] = await connect.execute(
    name ? `SELECT id, name, role, portrait, mail, remark, create_time, is_receive FROM users WHERE name = ?;`
    : `SELECT id, name, role, portrait, remark, create_time, is_receive FROM users;`,
    [name]
  );
  connect.end();
  return rows;
}

/**
 * 查询用户信息（含密码）
 * @param nameOrMail 用户名或邮箱
 * @returns 
 */
export async function sql_queryUserData(nameOrMail: string | null = null) {
  const connect = await connection();
  const [rows] = await connect.execute(
    `SELECT * FROM users WHERE name = ? or mail = ?;`,
    [nameOrMail, nameOrMail]
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
/**
 * 添加用户
 * @param params
 * @returns 
 */
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

interface InfoParams {
  [prop: string]: string
}
/**
 * 设置用户信息
 */
export async function sql_setUserInfo(id = '', infos: InfoParams) {
  let sql = '';
  for (const prop in infos) {
    sql += `${prop} = '${infos[prop]}',`;
  }
  const connect = await connection();
  const [rows] = await connect.execute(
    `UPDATE users SET ${sql.slice(0, -1)} WHERE id = ${id};`,
  );
  connect.end();
  return rows;
}
