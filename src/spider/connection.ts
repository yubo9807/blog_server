import { createConnection } from 'mysql2/promise';
import { sqlKey } from '../_power';

export default async function () {
  return await createConnection(sqlKey);
}
