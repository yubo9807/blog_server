import { Context, Next } from 'koa';
import { throwError } from '@/services/errorDealWith';
import { publishJwt, verifyJwt } from '@/services/jwt';
import { sql_addUser, sql_getUserList, sql_queryUserData } from '@/spider/user';
import redis from '@/services/redis';
import { getNowDate } from '@/utils/date';
import { getAuthorization } from '@/services/authorization';

const signInUsersKey = 'signInUsers';

export default class {

  /**
   * 登录
   */
  static async signIn(ctx: Context, next: Next) {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      throwError(ctx, 406);
    }

    const rows = await sql_queryUserData(username);
    const userData = rows[0];

    if (!userData) {
      throwError(ctx, 500, '用户不存在');
    }
    
    if (username !== userData.name || password !== await verifyJwt(userData.pass)) {
      throwError(ctx, 500, '用户名或密码错误');
    }

    // 添加到 redis 里
    redis.deposit(signInUsersKey, async () => {
      const list = await redis.deposit(signInUsersKey) || [];
      const index = list.findIndex(val => val.name === username);
      const { pass, ...args } = userData;
      index < 0 && list.push(args);
      return list;
    }, -1, true);

    ctx.body = {
      token: publishJwt({ name: username, pass: password, id: userData.id, role: userData.role })
    };
    next();
  }

  /**
   * 注册用户
   */
  static async signUp(ctx: Context, next: Next) {
    const { username, password, mail, mailCode, isReceive } = ctx.request.body;
  
    if (!username || !password) {
      throwError(ctx, 406);
    }
  
    const rows = await sql_queryUserData(username);
    if (rows[0]) {
      throwError(ctx, 500, '用户已存在');
    }
  
    // 验证邮箱验证码
    if (mail) {
      const rows = await sql_queryUserData(mail);
      if (rows[0]) {
        throwError(ctx, 500, '该邮箱已注册，请更换邮箱或注销账号');
      }
      if (mailCode) {
        const code = await redis.deposit(mail);
        if (code !== mailCode) {
          throwError(ctx, 500, '验证码错误');
        }
      } else {
        throwError(ctx, 406);
      }
    }
  
    const pass = publishJwt(password, null);
    const params = {
      name: username,
      pass: pass,
      mail: mail ?? null,
      create_time: getNowDate(),
      is_receive: isReceive || 0
    }
    
    const row = await sql_addUser(params);
    ctx.body = '注册成功';
    next();
  }

  /**
   * 修改密码
   */
  static async modifyPass(ctx: Context, next: Next) {
    const { userName, oldPasswrod, mail, mailCode } = ctx.query;
    if (!userName || !mail || !mailCode) {
      throwError(ctx, 406);
    }
    
    const rows = await sql_getUserList(userName);
    if (!rows[0]) {
      throwError(ctx, 500, '用户不存在');
    }
    if (userName === rows[0].name && mail !== rows[0].mail) {
      throwError(ctx, 500, '邮箱错误');
    }
  
    const randomNum = await redis.deposit(mail);
    if (mailCode !== randomNum) {
      throwError(ctx, 500, '验证码错误');
    }
  
    ctx.body = '修改成功';
    next();
  }

  /**
   * 获取用户信息
   */
  static async current(ctx: Context, next: Next) {
    const user = await getAuthorization(ctx);
  
    const { name } = user;
  
    if (!name) {
      throwError(ctx, 500, '没有该用户信息');
    }
  
  
    let userData = {}
    const userList = await redis.deposit(signInUsersKey, async () => {
      return await redis.deposit(signInUsersKey) || [];
    });
    const index = userList.findIndex(val => val.name === name);
  
    // 先看缓存中有没有；缓存中没有存过该用户信息，查数据库
    if (index >= 0) {
      userData = userList[index];
    } else {
      const row = (await sql_queryUserData(name))[0];
      const { pass, ...args } = row;
      userData = args;
    }
  
  
    if (!userData) {
      throwError(ctx, 500, '用户不存在');
    }
  
  
    // 防止 服务器重启的情况下，缓存数据会丢失
    redis.deposit(signInUsersKey, async () => {
      const list = await redis.deposit(signInUsersKey) || [];
      const index = list.findIndex(val => val.name === name);
      index < 0 && list.push(userData);
      return list;
    }, -1, true);
  
  
    ctx.body = userData;
    next();
  }

}