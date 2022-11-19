import { Router } from '@/services/koa-router';
import authorization from '@/middleware/authorization';
import { SUPER, REGULATORY } from '@/constant/role';
import { BASE_API } from '@/constant/route';

const route_api = new Router(BASE_API);

// 访问记录
import Access from '@/controller/access';
route_api.get('/access', Access.gain, Access.filter, Access.paging).exec();
route_api.get('/access/chart', Access.gain, Access.statistical).exec();
route_api.post('/access', authorization(SUPER), Access.write).exec();

// 黑名单
import Blacklist from '@/controller/blacklist';
route_api.get('/blacklist', Blacklist.list).exec();
route_api.post('/blacklist', authorization(SUPER, REGULATORY), Blacklist.add).exec();
route_api.delete('/blacklist', authorization(SUPER), Blacklist.delete).exec();

// 友链
import FriendLink from '@/controller/friendLink';
route_api.get('/friendLink', FriendLink.list).exec();
route_api.post('/friendLink', authorization(SUPER), FriendLink.add).exec();
route_api.put('/friendLink', authorization(SUPER), FriendLink.modify).exec();

// redis
import Redis from '@/controller/memory/redis';
route_api.get('/memory/redis', Redis.gain).exec();
route_api.delete('/memory/redis', authorization(SUPER), Redis.clear).exec();

// 菜单
import Menu from '@/controller/menu';
route_api.get('/menu/list', Menu.list).exec();
route_api.post('/menu/init', authorization(SUPER), Menu.init).exec();
route_api.put('/menu/order', authorization(SUPER), Menu.order).exec();
route_api.put('/menu/config', authorization(SUPER), Menu.config).exec();

// 系统信息
import OS from '@/controller/os';
route_api.get('/os', OS.info).exec();
route_api.get('/os/dynamic', OS.dynamic).exec();

// 角色
import Role from '@/controller/role';
route_api.get('/role', Role.gain).exec();

// 用户信息，注册，登录
import User  from '@/controller/user';
import Login from '@/controller/user/login';
import Mail  from '@/controller/user/mail';
route_api.get('/user/list', User.list).exec();
route_api.get('/user/mailCode', Mail.gainCode).exec();
route_api.get('/user/current', Login.current).exec();
route_api.post('/user/signUp', Login.signUp).exec();
route_api.post('/user/signIn', Login.signIn).exec();
route_api.post('/user/modify', Login.modifyPass).exec();

// 文件
import File     from '@/controller/file/main';
import Logs     from '@/controller/file/logs';
import Portrait from '@/controller/file/portrait';
import Sitemap  from '@/controller/file/sitemap'; 
route_api.get('/file/read', File.read).exec();
route_api.get('/file/read/logs', authorization(SUPER), Logs.read).exec();
route_api.get('/file/search', File.search).exec();
route_api.post('/file/upload/portrait', Portrait.limit, Portrait.upload).exec();
route_api.post('/file/write/sitemap', authorization(SUPER), Sitemap.init).exec();

import Interface from '@/controller/interface';
route_api.get('/routes', Interface.gain)
  .state({ noBack: true })
  .exec();
