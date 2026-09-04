// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { login, getMe, adminTest } from '../controllers/auth.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateLogin } from '../validators/auth.validator';
import { loginRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes
router.post('/login', loginRateLimiter, validateLogin, login);

// Authenticated routes
router.get('/me', authenticate, getMe);

// Admin-only protected routes
router.get('/admin-test', authenticate, requireAdmin, adminTest);

export default router;
