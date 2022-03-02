import { createNum } from '@/utils/number';
const iter = createNum();

interface ChatRecord {
  id: string | number
  createTime: number
  userName: string
  text: string
  roomId: string | number
}
interface SystemInfo {
  id: string | number
  createTime: number
  userName: string
  roomName: string
}
const recordList: ChatRecord[] = [
  { id: '2', userName: 'test', text: 'hhhhhhhh', createTime: 321313, roomId: '1'  }
];
const systemInfoList: SystemInfo[] = [];

/**
 * 查找相关的聊天记录
 * @param roomId 
 * @returns 
 */
export function getChatRecord(roomId: string | number) {
  return recordList.filter(val => val.roomId == roomId);
}

export function addChatRecord(userName: string, text: string, roomId: string) {
  const id = iter.next().value, createTime = Date.now() / 1000;
  recordList.push({ id: (id as number), userName, text, roomId, createTime })
}
