import chat from './chat';
import env from '../env';
import { createLogger } from '@/services/logger';
import { dateFormater } from '@/utils/date';

export default async(server) => {
  try {
    chat(server, env.BASE_SOCKET + '/chat');
  } catch (error) {
    const day = dateFormater('YYYY-MM-DD');
    createLogger(day, 'Socket', '\n' + error.stack);
  }
}
