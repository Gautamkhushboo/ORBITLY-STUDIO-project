// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { CLIENT_URL, getDatabaseStatus } from './config';
import apiRoutes from './routes';

const app = express();

// Global middleware
app.use(express.json());
app.use(cors({ origin: CLIENT_URL || '*' }));
app.use(helmet());
app.use(morgan('dev'));

// Basic global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// Health check route
app.get('/api/health', (_req, res) => {
  const dbStatus = getDatabaseStatus();
  res.json({
    success: true,
    message: 'Orbitly Studio API is healthy',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
    },
  });
});

// API Routes
app.use('/api', apiRoutes);

export default app;

