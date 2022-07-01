import Router from '@koa/router';
import os from 'os';

const route = new Router();

// 获取系统信息
route.get('/', async(ctx, next) => {
  
  const { arch, cpus, freemem, totalmem, hostname, endianness, loadavg, release, type, uptime, version } = os;

  ctx.body = {
    arch: arch(),
    cpu: cpus()[0],  // cpu 信息 *
    freemem: freemem(),  // 可用内存 *
    totalmem: totalmem(),  // 总内存
    hostname: hostname(),  // 主机名
    endianness: endianness(),  // 大端序 'BE' || 小端序 'LE'
    loadavg: loadavg(),  // 负载
    release: release(),  // 操作系统
    type: type(),  // 操作系统类型
    uptime: uptime(),  // 系统运行时间(秒) *
    version: version(),  // 内核版本
  };
  next();
})

export = route;
