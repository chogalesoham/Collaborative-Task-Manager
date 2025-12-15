import { Router } from 'express';
import authRoutes from './auth.routes.js';
import taskRoutes from './task.routes.js';
import userRoutes from './user.routes.js';
import notificationRoutes from './notification.routes.js';

const router = Router();

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/tasks', taskRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/notifications', notificationRoutes);

export default router;
