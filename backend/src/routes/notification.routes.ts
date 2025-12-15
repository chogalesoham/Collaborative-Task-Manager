import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

export default router;
