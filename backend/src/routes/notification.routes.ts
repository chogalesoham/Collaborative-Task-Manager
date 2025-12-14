import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All notification routes require authentication
router.use(authMiddleware);

// Get user notifications
router.get('/', notificationController.getNotifications);

// Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all as read
router.patch('/mark-all-read', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

export default router;
