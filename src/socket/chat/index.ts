import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import env from '../../env';
import { verifyJwt } from '@/services/jwt';
import { sql_queryUserData, sql_getUserList } from '@/spider/user';
import { sql_getRoomList } from '@/spider/chat';
import { getChatRecord } from './data';

export default (server: HttpServer, path: string) => {
  const io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN,
    },
    path,
  });
  
  // 建立连接
  io.on('connection', async(socket) => {
    const authorization = socket.request.headers.authorization || '';
    const { name: userName } = verifyJwt(authorization);
    const isExist = (await sql_queryUserData(userName))[0];
    if (!isExist) {
      socket.emit('errorMessage', { code: 405, msg: '登录信息错误' });
      return;
    }

    // 返回所有用户列表
    const users = await sql_getUserList();
    // 看当前账号拥有的房间
    const roomList = await sql_getRoomList(userName);
    socket.emit('users', users);
    socket.emit('rooms', roomList);
    socket.broadcast.emit('online', `${userName} 上线了`);

    socket.on('roomNum', async chunk => {
      const { roomId } = chunk;
      const rooms = getChatRecord(roomId);  // 查找相关聊天记录
      socket.emit(`chatRecord`, rooms);
    })

    socket.on('addRecord', async chunk => {
      const { userName, text, time, roomId } = chunk;
      // 添加聊天记录
      
      const rooms = getChatRecord(roomId);  // 查找相关聊天记录
      socket.broadcast.emit('chatRecord', rooms);
    })

    socket.on('addRoom', async chunk => {
      const { roomId, roomname, admin, time } = chunk;
      // 创建房间

      // 获取拥有的房间
      
      socket.emit('rooms', []);
    })

    socket.on('jionRoom', async chunk => {
      const { userId, roomId, time } = chunk;
      // 查看是否已经存在于改房间中
      // 加入房间
      
      socket.emit(`roomMsg${roomId}`, '已加入该房间');
    })

    socket.on('outRoom', async chunk => {
      const { admin, roomId, userId, userName } = chunk;
      // 查看是否已经存在于改房间中
      // 退出群聊

      socket.emit(`roomMsg${roomId}`, `${userName} 已退出群聊`);
    })

    // 用户掉线
    socket.on('outline', async chunk => {
      const { userName } = chunk;
      socket.broadcast.emit('new outline', `${userName} 掉线`);
    })


    // 客户端断开连接
    socket.on('disconnect', () => {
      socket.broadcast.emit("userout", '退出聊天室');
    })

  })
}