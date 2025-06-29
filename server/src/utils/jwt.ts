import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth';

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    },
    secret,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  
  const decoded = jwt.verify(token, secret) as any;
  return {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role
  };
};