import chat from './chat';
import env from '../env';

export default async(server) => {

  chat(server, env.BASE_SOCKET + '/chat');

}
