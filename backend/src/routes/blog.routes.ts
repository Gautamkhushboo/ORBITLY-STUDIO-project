// backend/src/routes/blog.routes.ts
import { Router } from 'express';
import {
  getPublicBlogs,
  getPublicBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateCreateBlog, validateUpdateBlog } from '../validators/blog.validator';
import { writeRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes (published = true only)
router.get('/', getPublicBlogs);
router.get('/:slug', getPublicBlogBySlug);

// Admin-only write routes
router.post(
  '/',
  authenticate,
  requireAdmin,
  writeRateLimiter,
  validateCreateBlog,
  createBlog
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  writeRateLimiter,
  validateUpdateBlog,
  updateBlog
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  writeRateLimiter,
  deleteBlog
);

export default router;
