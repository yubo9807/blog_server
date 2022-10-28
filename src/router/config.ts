import { Router } from '@/services/koa-router';

const route_api = new Router('/api');


// 访问记录
import Access from '@/controller/access';
route_api.method('GET',  '/access', Access.gain ).exec();
route_api.method('POST', '/access', Access.write).exec();

// 黑名单
import Blacklist from '@/controller/blacklist';
route_api.method('GET',    '/blacklist', Blacklist.list  ).exec();
route_api.method('POST',   '/blacklist', Blacklist.add   ).exec();
route_api.method('DELETE', '/blacklist', Blacklist.delete).exec();

// 友链
import FriendLink from '@/controller/friendLink';
route_api.method('GET',  '/friendLink', FriendLink.list  ).exec();
route_api.method('POST', '/friendLink', FriendLink.add   ).exec();
route_api.method('PUT',  '/friendLink', FriendLink.modify).exec();

// redis
import Redis from '@/controller/memory/redis';
route_api.method('GET',    '/memory/redis', Redis.gain ).exec();
route_api.method('DELETE', '/memory/redis', Redis.clear).exec();

// 菜单
import Menu from '@/controller/menu';
route_api.method('GET',  '/menu/list',   Menu.list  ).exec();
route_api.method('POST', '/menu/init',   Menu.init  ).exec();
route_api.method('PUT',  '/menu/order',  Menu.order ).exec();
route_api.method('PUT',  '/menu/config', Menu.config).exec();

// 系统信息
import OS from '@/controller/os';
route_api.method('GET', '/os',         OS.info   ).exec();
route_api.method('GET', '/os/dynamic', OS.dynamic).exec();

// 角色
import Role from '@/controller/role';
route_api.method('GET', '/role', Role.gain).exec();

// 用户信息，注册，登录
import User  from '@/controller/user';
import Login from '@/controller/user/login';
import Mail  from '@/controller/user/mail';
route_api.method('GET',  '/user/list',     User.list       ).exec();
route_api.method('GET',  '/user/mailCode', Mail.gainCode   ).exec();
route_api.method('GET',  '/user/current',  Login.current   ).exec();
route_api.method('POST', '/user/signUp',   Login.signUp    ).exec();
route_api.method('POST', '/user/signIn',   Login.signIn    ).exec();
route_api.method('POST', '/user/modify',   Login.modifyPass).exec();

// 文件
import File     from '@/controller/file/main';
import Logs     from '@/controller/file/logs';
import Portrait from '@/controller/file/portrait';
import Sitemap  from '@/controller/file/sitemap'; 
route_api.method('GET',  '/file/read',            File.read                      ).exec();
route_api.method('GET',  '/file/read/logs',       Logs.read                      ).exec();
route_api.method('GET',  '/file/search',          File.search                    ).exec();
route_api.method('POST', '/file/upload/portrait', Portrait.limit, Portrait.upload).exec();
route_api.method('POST', '/file/write/sitemap',   Sitemap.init                   ).exec();

import Interface from '@/controller/interface';
route_api.method('GET', '/routes', Interface.gain)
  .state({ noBack: true })
  .exec();
