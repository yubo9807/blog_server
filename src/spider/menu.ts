import connection from './connection';


// 获取所有菜单
export async function sql_getMenuList() {
  const connect = await connection();
  const [ rows ] = await connect.execute('SELECT * FROM menu_control ORDER BY id ASC;');
  connect.end();
  return rows;
}


// 添加菜单
export async function sql_appMenuList(list: any[]) {

  function createSql(arr: any[]) {
    let sql = '';
    arr.forEach((val: any) => {
      const parent = val.parent ? `'${val.parent}'` : null;
      sql += `('${val.id}', '${val.name}', '${val.title}', ${parent}),`;
    });
    return sql.slice(0, -1);
  }

  const connect = await connection();
  const [rows] = await connect.execute(
    `INSERT INTO menu_control (id, name, title, parent)
    VALUES ${createSql(list)};`
  );
  connect.end();
  return rows;
}

// 批量修改菜单
export async function sql_modifyMenuList(list: any[]) {

  function createSql(arr: any[]) {
    let sql = '';
    arr.forEach((val: any) => {
      const parent = val.parent ? `'${val.parent}'` : null;
      sql += `('${val.id}', '${val.title}', ${parent}),`;
    });
    return sql.slice(0, -1);
  }

  const connect = await connection();
  const [rows] = await connect.execute(
    `INSERT INTO menu_control (id, title, parent)
    VALUES ${createSql(list)}
    ON DUPLICATE KEY UPDATE title=VALUES(title), parent=VALUES(parent);`
  );
  connect.end();
  return rows;
}

// 菜单排序
export async function sql_replaceMenuOrder(id1, id2) {

  const tableInfo = await sql_lookTableInfo();
  let sql = '';
  (tableInfo as any[]).forEach(val => {
    if (val.Field !== 'id') sql += `a.${val.Field} = b.${val.Field},`;
  })

  const connect = await connection();
  const [rows] = await connect.execute(
    `UPDATE menu_control AS a JOIN menu_control AS b
    ON (a.id = ${id1} AND b.id = ${id2}) OR (a.id = ${id2} AND b.id = ${id1})
    SET ${sql.slice(0, -1)};`
  );
  connect.end();
  return rows;
}

// 删除菜单
export async function sql_deleteMenuList(list: number[] | string[]) {
  const connect = await connection();
  const [rows] = await connect.execute(
    `DELETE FROM menu_control WHERE id IN (${list.join(',')});`
  );
  connect.end();
  return rows;
}

interface ModifyObj {
  hidden: number
  disable: number
  no_cache: number
  always_show: number
}

// 修改菜单配置
export async function sql_modifyMenuConfig(id: string | number, obj: ModifyObj) {

  let sql = '';
  for (const prop in obj) {
    sql += `${prop} = ${obj[prop]},`;
  }

  const connect = await connection();
  const [rows] = await connect.execute(
    `UPDATE menu_control SET ${sql.slice(0, -1)} WHERE id = ${id};`
  );
  connect.end();
  return rows;
}


// 查看表信息
async function sql_lookTableInfo() {
  const connect = await connection();
  const [ rows ] = await connect.execute(
    `SHOW FULL COLUMNS FROM menu_control;`
  );
  connect.end();
  return rows;
}