// backend/src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

/**
 * Rate limiter specifically for login endpoint
 * Limits repeated attempts per windowMs
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
  },
});

/**
 * Rate limiter for write operations (POST, PUT, DELETE)
 */
export const writeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // 60 write requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many write requests. Please try again later.',
  },
});

