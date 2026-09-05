// backend/src/config/index.ts
import dotenv from 'dotenv';
import { parseAndSanitizeMongoUri } from './database';

dotenv.config();

const rawMongoUri = process.env.MONGODB_URI || '';
export const MONGODB_URI = parseAndSanitizeMongoUri(rawMongoUri).sanitizedUri || rawMongoUri.trim();
export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_key_orbitly';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const CLIENT_URL = (process.env.CLIENT_URL || '').trim().replace(/\/+$/, '');

export const getAllowedOrigins = (): string[] => {
  const raw = process.env.CLIENT_URL || '';
  const parsed = raw
    .split(',')
    .map((u) => u.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  return [
    ...parsed,
    'https://orbitly-studio-project-frontend-9r8c-1fponholi-gautamkhushboo.vercel.app',
    'https://orbitly-studio-project-frontend-9r8c-lfponh0li-gautamkhushboo.vercel.app',
    'https://orbitly-studio-project.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
  ];
};

export const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export { connectDatabase, getDatabaseStatus, parseAndSanitizeMongoUri } from './database';
