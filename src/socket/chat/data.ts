import { getNowDate } from '@/utils/date';
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

/**
 * 添加聊天记录
 * @param userName
 * @param text 
 * @param roomId 
 */
export function addChatRecord({ userName, text, roomId }) {
  const id = iter.next().value, createTime = getNowDate();
  recordList.push({ id: (id as number), userName, text, roomId, createTime })
}

export function deleteChatRecord(roomId) {
  recordList.forEach(val => {
    if (val.roomId == roomId) {}
  })
}
