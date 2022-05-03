import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import env from '../../env';
import { verifyJwt } from '@/services/jwt';
import { sql_queryUserData, sql_getUserList } from '@/spider/user';
import { sql_createRoom, sql_deleteRoom, sql_getRoomList, sql_queryRoomId, sql_outRoom, sql_jionRoom, sql_updateRoomName } from '@/spider/chat';
import { getChatRecord, addChatRecord, deleteChatRecord } from './data';

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
    const userInfo = (await sql_queryUserData(userName))[0];
    if (!userInfo) {
      socket.emit('message', { code: 405, msg: '登录信息错误' });
      return;
    }

  
    // 返回所有用户列表，拥有的房间列表
    const users = await sql_getUserList();
    const rooms = await sql_getRoomList(userName);  // 看当前账号拥有的房间
    socket.emit('users', users);
    socket.emit(`rooms_${userName}`, rooms);
    socket.broadcast.emit('online', `${userName} 上线了`);


    // #region 聊天记录

    // 查找相关聊天记录
    socket.on(`queryRecord`, async chunk => {
      const { roomId } = chunk;
      const records = getChatRecord(roomId);
      socket.emit(`record_${roomId}`, records);
    })



    // 添加聊天记录
    socket.on('addRecord', async chunk => {
      const { text, roomId } = chunk;
      addChatRecord({ userName, portrait: userInfo.portrait, text, roomId });
      const records = getChatRecord(roomId);  // 查找相关聊天记录
      socket.broadcast.emit(`record_${roomId}`, records);
      socket.emit(`record_${roomId}`, records);
    })

    // #endregion



    // #region 房间

    // 创建房间
    socket.on('createRoom', async chunk => {
      const { roomName, names } = chunk;
      await sql_createRoom({ roomName, admin: userName });  // 创建房间
      const roomId = await sql_queryRoomId({ roomName, admin: userName });
      await sql_jionRoom(roomId, names);
      const rooms = await sql_getRoomList(userName);  // 获取拥有的房间
      socket.emit(`rooms_${userName}`, rooms);
    })

    // 加入房间
    socket.on('jionRoom', async chunk => {
      const { roomId } = chunk;
      const rooms = await sql_getRoomList(userName);
      if (rooms.length > 0) {
        socket.emit('message', { code: 500, msg: '您已存在群聊中' });
        return;
      }
    })

    // 退出房间
    socket.on('outRoom', async chunk => {
      const { roomId, admin } = chunk;
      if (admin === userName) {
        socket.emit('message', { code: 500, msg: '您是群聊的管理员，退出后群聊将会解散' });
        return;
      }
      await sql_outRoom({ roomId, userName });  // 退出群聊
      socket.broadcast.emit(`roomMsg${roomId}`, `${userName} 已退出群聊`);
    })

    // 删除房间
    socket.on('delRoom', async chunk => {
      const { roomId, admin } = chunk;
      if (admin !== userName) {
        socket.emit('message', { code: 500, msg: '您不是群聊的管理员' });
        return;
      }
      await sql_deleteRoom(roomId);  // 删除房间
      deleteChatRecord(roomId);  // 删除相关的聊天记录
      const rooms = await sql_getRoomList(userName);  // 获取拥有的房间
      socket.emit(`rooms_${userName}`, rooms);
    })

    // 修改房间名称
    socket.on('fixRoomName', async chunk => {
      const { roomId, admin, name } = chunk;
      if (!name) {
        socket.emit('message', { code: 500, msg: '房间名称不能为空' });
        return;
      }
      if (admin !== userName) {
        socket.emit('message', { code: 500, msg: '您不是群聊的管理员' });
        return;
      }
      await sql_updateRoomName(roomId, name);  // 修改房间名称
      const rooms = await sql_getRoomList(userName);  // 获取拥有的房间
      socket.emit(`rooms_${userName}`, rooms);
    })

    // #endregion



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