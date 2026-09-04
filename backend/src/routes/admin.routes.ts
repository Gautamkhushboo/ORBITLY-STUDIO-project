// backend/src/routes/admin.routes.ts
import { Router } from 'express';
import { getAdminProjects } from '../controllers/project.controller';
import { getAdminBlogs } from '../controllers/blog.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// Admin listing endpoints (returns both published and draft items)
router.get('/projects', getAdminProjects);
router.get('/blog', getAdminBlogs);

export default router;
