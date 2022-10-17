import { Context, Next } from 'koa';
import os from 'os';

export default class {

  /**
   * 获取系统信息
   */
  static async gain(ctx: Context, next: Next) {
  
    const { arch, cpus, hostname, endianness, release, type, uptime, version } = os;
  
    ctx.body = {
      arch:       arch(),
      cpu:        cpus()[0],     // cpu 信息
      hostname:   hostname(),    // 主机名
      endianness: endianness(),  // 大端序 'BE' || 小端序 'LE'
      release:    release(),     // 操作系统
      type:       type(),        // 操作系统类型
      uptime:     uptime(),      // 系统运行时间(秒)
      version:    version(),     // 内核版本
    };
    next();
  }

  /**
   * 获取动态数据
   */
  static async dynamic(ctx: Context, next: Next) {

    const { freemem, totalmem, loadavg } = os;
  
    ctx.body = {
      freemem:  freemem(),   // 可用内存
      totalmem: totalmem(),  // 总内存
      loadavg:  loadavg(),   // 负载
    };
    next();
  }

}
