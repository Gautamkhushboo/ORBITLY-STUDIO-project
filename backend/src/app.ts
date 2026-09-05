// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { CLIENT_URL, getAllowedOrigins, getDatabaseStatus } from './config';
import apiRoutes from './routes';
import { publicReadLimiter } from './middleware/rateLimiter';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler';

const app = express();

// CORS Configuration: dynamically allows configured domains, localhost, and Vercel deployments (previews + production)
const isOriginAllowed = (origin?: string): boolean => {
  // Allow requests with no origin (curl, mobile apps, server-to-server)
  if (!origin) return true;

  const cleanOrigin = origin.trim().replace(/\/+$/, '').toLowerCase();
  const origins = getAllowedOrigins().map((o) => o.trim().replace(/\/+$/, '').toLowerCase());

  // Allow wildcard or exact match
  if (origins.includes('*') || origins.includes(cleanOrigin)) return true;

  // Allow any Vercel deployment (*.vercel.app) including preview and branch deployments
  if (/^https:\/\/([a-zA-Z0-9-]+\.)*vercel\.app$/i.test(origin.trim().replace(/\/+$/, ''))) return true;

  // Allow any localhost / 127.0.0.1 port
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin.trim().replace(/\/+$/, ''))) return true;

  return false;
};

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      // Return true to reflect incoming origin and allow credentials without wildcard '*'
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

// Handle CORS before other middleware to ensure clean preflight handling
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Request parsing with sensible size limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(morgan('dev'));

// Generous public API rate limiter (does not impede legitimate browsing)
app.use('/api', publicReadLimiter);

// Health check route
app.get('/api/health', (_req, res) => {
  const dbStatus = getDatabaseStatus();
  const isConnected = dbStatus === 'connected';
  res.json({
    success: isConnected,
    message: isConnected ? 'Orbitly Studio API is healthy' : 'Orbitly Studio API is running (database disconnected)',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
    },
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global centralized error handler
app.use(globalErrorHandler);

export default app;


