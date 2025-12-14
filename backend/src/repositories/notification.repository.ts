import prisma from '../lib/prisma.js';
import { CreateNotificationInput, Notification } from '../models/notification.model.js';

export class NotificationRepository {
  /**
   * Create notification
   */
  async create(data: CreateNotificationInput): Promise<Notification> {
    return await prisma.notification.create({
      data: {
        type: data.type,
        message: data.message,
        taskId: data.taskId || null,
        userId: data.userId,
      },
    });
  }

  /**
   * Get user notifications
   */
  async findByUserId(userId: number, limit: number = 50): Promise<Notification[]> {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(userId: number): Promise<number> {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: number): Promise<Notification> {
    return await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /**
   * Mark all user notifications as read
   */
  async markAllAsRead(userId: number): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  /**
   * Delete notification
   */
  async delete(id: number): Promise<void> {
    await prisma.notification.delete({
      where: { id },
    });
  }
}

export const notificationRepository = new NotificationRepository();
