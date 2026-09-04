// backend/src/config/database.ts
import mongoose from 'mongoose';
import { MONGODB_URI } from './index';

export const getDatabaseStatus = (): string => {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

export const connectDatabase = async (): Promise<void> => {
  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not defined in environment variables. Database connection skipped.');
    return;
  }

  try {
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('ℹ️ MongoDB disconnected');
    });

    await mongoose.connect(MONGODB_URI);
  } catch (error: any) {
    const safeMessage = error?.message?.replace(/\/\/.*@/, '//<credentials>@') || 'Database connection error';
    console.error('❌ MongoDB connection failed:', safeMessage);
  }
};
