import { Notification as PrismaNotification, NotificationType as PrismaNotificationType } from '@prisma/client';

export type NotificationType = PrismaNotificationType;
export const NotificationType = PrismaNotificationType;

export type Notification = PrismaNotification;

export interface CreateNotificationInput {
  type: NotificationType;
  message: string;
  taskId?: number;
  userId: number;
}
