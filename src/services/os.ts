import env from '../env';
import os from 'os';
import { sql_osDataDeposit } from '../spider/os';
const { 'log': c } = console;

// const arch = os.arch();
// const cpus = os.cpus()[0];  // cpu 信息 *
// const freemem = os.freemem();  // 可用内存 *
// const totalmem = os.totalmem();  // 总内存
// const hostname = os.hostname();  // 主机名
// const endianness = os.endianness();  // 大端序 'BE' || 小端序 'LE'
// const loadavg = os.loadavg();  // 负载
// const release = os.release();  // 操作系统
// const type = os.type();  // 操作系统类型
// const uptime = os.uptime();  // 系统运行时间 *
// const version = os.version();  // 内核版本
// const model = cpus.model;  // cpu 型号
// const times = cpus.times;

let timer = null, count = 0, osList = [];

function timingTask() {
  timer = setInterval(async() => {
    const cpus = os.cpus();
    const freemem = os.freemem();
    const uptime = os.uptime();
    const { speed, times } = cpus[0];
    const params = [
      freemem,
      uptime,
      speed,
      times.user,
      times.nice,
      times.sys,
      times.idle,
      times.irq,
      Date.now(),
    ]
    osList.push(params);

    if (count++ >= 11) {  // 每过两分钟存一次数据
      await sql_osDataDeposit(osList);
      count = 0;
      clearInterval(timer);
      timer = null;
      osList = [];
      timingTask();
    }

  }, 1000 * 10)  // 10s 获取一次数据
}

if (env.NODE_ENV === 'development') {
  timingTask();
}