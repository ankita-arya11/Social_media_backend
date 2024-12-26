import jwt from 'jsonwebtoken';
import { config } from '../config/index';

const SECRET_KEY = config.JWT_SECRET_KEY || 'your-secret-key';
const TOKEN_EXPIRATION = '1h';

export const generateToken = (email: string): string => {
  if (!SECRET_KEY) {
    throw new Error('Missing SECRET_KEY environment variable');
  }
  return jwt.sign({ email }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
};

export const verifyToken = (token: string): any => {
  if (!SECRET_KEY) {
    throw new Error('Missing SECRET_KEY environment variable');
  }
  return jwt.verify(token, SECRET_KEY);
};
