// backend/src/utils/jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config';

export interface UserTokenPayload {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

/**
 * Generate a signed JWT for an authenticated user
 */
export const generateToken = (payload: UserTokenPayload): string => {
  const options: SignOptions = {
    expiresIn: (JWT_EXPIRES_IN as any) || '7d',
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verify and decode a JWT
 */
export const verifyToken = (token: string): UserTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as UserTokenPayload;
};
