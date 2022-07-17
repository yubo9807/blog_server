import { sign, verify, SignOptions } from 'jsonwebtoken';
import { jwtKey } from '../_power';

const defaultOption = {
  expiresIn: '2 days',  // 默认过期时间：2天
}

/**
 * 颁发 jwt
 * @param info 
 * @returns 
 */
export function publishJwt(info: any, options: SignOptions = defaultOption) {
  return sign(info, jwtKey, options);
}

/**
 * 校验 jwt
 * @param content 
 * @returns 
 */
export function verifyJwt(content: any) {
  try {
    return Promise.resolve(verify(content, jwtKey));
  } catch (error) {
    return Promise.reject(error.message);
  }
}
