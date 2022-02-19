import { networkInterfaces } from 'os';
import { createServer } from 'net';


/**
 * 获取 IP4 地址
 * @returns 
 */
export function getIP4Address() {
  const { en0 } = networkInterfaces();
  if (!en0) return;

  const enAddress = en0.find(val => val.family === 'IPv4').address;
  return enAddress;
}


/**
 * 查看端口是否被占用
 * @param port 端口
 * @returns 未被占用返回本身，占用 +1
 */
export async function portIsOccupied(port: number) {
  const server = createServer().listen(port);

  await server.on('error', (err) => {
    if ((err as any).code === 'EADDRINUSE') {  // 端口已经被使用
      console.log(`${port} 端口已被占用，铁子`);
      port += 1;
    }
  })

  server.on('listening', async() => {  // 执行这块代码说明端口未被占用
    server.close();  // 关闭服务
  })

  return port;
}
