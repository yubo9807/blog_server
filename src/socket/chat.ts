const socketIO = require('socket.io');
import { Server} from 'socket.io';
import env from '../env';

export default (server, path: string) => {
  const io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN,
    },
    path,
  });
  
  // 建立连接
  io.on('connection', async(socket) => {
    console.log('建立连接')

    // 断开连接
    socket.on('disconnect', () => {
      console.log('断开连接')
    })

  })
}