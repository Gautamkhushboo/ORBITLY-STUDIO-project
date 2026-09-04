// backend/src/routes/project.routes.ts
import { Router } from 'express';
import {
  getPublicProjects,
  getPublicProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateCreateProject, validateUpdateProject } from '../validators/project.validator';
import { writeRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes (published = true only)
router.get('/', getPublicProjects);
router.get('/:slug', getPublicProjectBySlug);

// Admin-only write routes
router.post(
  '/',
  authenticate,
  requireAdmin,
  writeRateLimiter,
  validateCreateProject,
  createProject
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  writeRateLimiter,
  validateUpdateProject,
  updateProject
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  writeRateLimiter,
  deleteProject
);

export default router;
