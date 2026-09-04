// backend/src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || '';
export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const CLIENT_URL = process.env.CLIENT_URL || '';
