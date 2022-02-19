import { sql_getUserList } from '../../spider/user';
import Router from '@koa/router';
const user = new Router();

import signIn from './signIn';
import signUp from './signUp';
import current from './current';
import { getMailCode } from './mail';
import modifyPass from './modifyPass';
import userList from './list';

// 获取用户列表
user.get('/list', userList);

// 获取用户信息
user.get('/current', current);

// 注册
user.post('/signUp', signUp);

// 登录
user.post('/signIn', signIn);

// 发送邮箱验证码
user.get('/mailCode', getMailCode);

// 修改密码
user.post('/modify', modifyPass);

// 修改账户信息

export = user;
