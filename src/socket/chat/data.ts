import { getNowDate } from '@/utils/date';
import { createNum } from '@/utils/number';
const iter = createNum();

interface ChatRecord {
  id: string | number
  createTime: number
  userName: string
  portrait: string
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
  // { id: '2', userName: 'test', portrait: '', text: 'hhhhhhhh', createTime: 1646873026, roomId: '1'  },
  // { id: '3', userName: '不知道是谁', portrait: '', text: '零零落落零零落落了', createTime: 1646873036, roomId: '1'  },
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
export function addChatRecord({ userName, portrait, text, roomId }) {
  const id = iter.next().value, createTime = getNowDate();
  recordList.push({ id: (id as number), userName, portrait, text, roomId, createTime })
}

export function deleteChatRecord(roomId) {
  recordList.forEach(val => {
    if (val.roomId == roomId) {}
  })
}
