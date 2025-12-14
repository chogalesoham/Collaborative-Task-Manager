import { Response, NextFunction } from 'express';
import { notificationRepository } from '../repositories/notification.repository.js';

interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

import { Request } from 'express';

export class NotificationController {
  /**
   * Get user notifications
   */
  getNotifications = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const notifications = await notificationRepository.findByUserId(userId);

      res.status(200).json({
        success: true,
        data: notifications,
        count: notifications.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get unread notifications count
   */
  getUnreadCount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const count = await notificationRepository.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        count,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mark notification as read
   */
  markAsRead = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const notification = await notificationRepository.markAsRead(Number(id));

      res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mark all notifications as read
   */
  markAllAsRead = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      await notificationRepository.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete notification
   */
  deleteNotification = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await notificationRepository.delete(Number(id));

      res.status(200).json({
        success: true,
        message: 'Notification deleted',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const notificationController = new NotificationController();
