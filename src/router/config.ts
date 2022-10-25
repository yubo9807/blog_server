import { getRouteList, Router } from '@/services/koa-router';

const route_api = new Router('/api');


// 访问记录
import Access from '@/controller/access';
route_api.method('GET',  '/access', Access.gain );
route_api.method('POST', '/access', Access.write);

// 黑名单
import Blacklist from '@/controller/blacklist';
route_api.method('GET',    '/blacklist', Blacklist.gain  );
route_api.method('POST',   '/blacklist', Blacklist.add   );
route_api.method('DELETE', '/blacklist', Blacklist.delete);

// 友链
import FriendLink from '@/controller/friendLink';
route_api.method('GET',  '/friendLink', FriendLink.gain  );
route_api.method('POST', '/friendLink', FriendLink.add   );
route_api.method('PUT',  '/friendLink', FriendLink.modify);

// redis
import Redis from '@/controller/memory/redis';
route_api.method('GET',    '/memory/redis', Redis.gain );
route_api.method('DELETE', '/memory/redis', Redis.clear);

// 菜单
import Menu from '@/controller/menu';
route_api.method('GET',  '/menu/list',   Menu.gain  );
route_api.method('POST', '/menu/init',   Menu.init  );
route_api.method('PUT',  '/menu/order',  Menu.order );
route_api.method('PUT',  '/menu/config', Menu.config);

// 系统信息
import OS from '@/controller/os';
route_api.method('GET', '/os',         OS.gain   );
route_api.method('GET', '/os/dynamic', OS.dynamic);

// 角色
import Role from '@/controller/role';
route_api.method('GET', '/role', Role.gain);

// 用户信息，注册，登录
import User  from '@/controller/user';
import Login from '@/controller/user/login';
import Mail  from '@/controller/user/mail';
route_api.method('GET',  '/user/list',     User.gain       );
route_api.method('GET',  '/user/mailCode', Mail.gainCode   );
route_api.method('GET',  '/user/current',  Login.current   );
route_api.method('POST', '/user/signUp',   Login.signUp    );
route_api.method('POST', '/user/signIn',   Login.signIn    );
route_api.method('POST', '/user/modify',   Login.modifyPass);

// 文件
import File     from '@/controller/file/main';
import Logs     from '@/controller/file/logs';
import Portrait from '@/controller/file/portrait';
import Sitemap  from '@/controller/file/sitemap'; 
route_api.method('GET',  '/file/read',            File.read                      );
route_api.method('GET',  '/file/read/logs',       Logs.read                      );
route_api.method('GET',  '/file/search',          File.search                    );
route_api.method('POST', '/file/upload/portrait', Portrait.limit, Portrait.upload);
route_api.method('POST', '/file/write/sitemap',   Sitemap.write                  );

import Interface from '@/controller/interface';
route_api.noBack();
route_api.method('GET', '/routes', Interface.gain);