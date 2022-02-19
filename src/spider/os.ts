import connection from './connection';

function createSql(arr: any[]) {
  let sql = '';
  arr.forEach((val: any[]) => {
    sql += `(${String(val)}),`;
  });
  return sql.slice(0, -1);
}

// 获取所有友链信息
export async function sql_osDataDeposit(list: any[]) {
  const connect = await connection();
  const [rows] = await connect.execute(
    `INSERT INTO os_record (freemem, uptime, cpu_speed, cpu_user, cpu_nice, cpu_sys, cpu_idle, cpu_irq, time)
    VALUES ${createSql(list)};`
  );
  connect.end();
  return rows;
}