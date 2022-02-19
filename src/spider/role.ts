import connection from './connection';


// 获取所有角色
export async function sql_getRoleList() {
  const connect = await connection();
  const [rows] = await connect.execute('SELECT * FROM roles;');
  connect.end();
  return rows;
}