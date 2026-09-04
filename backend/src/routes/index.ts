import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import blogRoutes from './blog.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/blog', blogRoutes);
router.use('/admin', adminRoutes);

export default router;

