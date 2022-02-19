import jwt from 'jsonwebtoken';
import { jwtKey } from '../_power';

// 颁发 jwt
export function publishJwt(info: any) {
  return jwt.sign(info, jwtKey);
}

// 校验 jwt
export function verifyJwt(content: any) {
  try {
    return jwt.verify(content, jwtKey)
  } catch (error) {
    return error;
  }
}