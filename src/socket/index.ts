import chat from './chat';
import env from '../env';

export default async(server) => {
  try {
    chat(server, env.BASE_SOCKET + '/chat');
  } catch (error) {
    console.log('error :>> ', error);
  }
}
