// backend/src/utils/password.ts
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a candidate plain text password with a stored bcrypt hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
