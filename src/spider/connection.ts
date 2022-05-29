import { createConnection } from 'mysql2/promise';
import { dateFormater } from '@/utils/date';
import { sqlKey } from '../_power';
import { createLogger } from '@/services/logger';

export default async function () {
  try {
    return await createConnection(sqlKey);
  } catch (error) {
    const day = dateFormater('YYYY-MM-DD');
    createLogger(day, '\n' + error.stack);
  }
}
