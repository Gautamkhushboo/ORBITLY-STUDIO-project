// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

const app = express();

// Global middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(helmet());
app.use(morgan('dev'));

// Basic rate limiter (example for login, can be refined later)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy' });
});

export default app;
