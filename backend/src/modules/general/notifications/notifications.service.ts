import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsTbl } from './entity/notifications.tbl';
import { CreateNotificationDto } from './dto/create-notification';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationsTbl)
    private notificationsRepository: Repository<NotificationsTbl>,
  ) {}

  async createNotification(
    data: CreateNotificationDto,
  ): Promise<NotificationsTbl> {
    const validTypes = [
      'payment_proof_rejected',
      'payment_proof_approved',
      'order_status_change',
      'new_order',
      'general',
    ];
    if (!validTypes.includes(data.type)) {
      throw new Error(`Invalid notification type: ${data.type}`);
    }

    if (data.metadata) {
      try {
        JSON.parse(data.metadata);
      } catch (e) {
        throw new Error(`Invalid metadata JSON: ${(e as Error).message}`);
      }
    }

    const notification = this.notificationsRepository.create({
      ...data,
      isRead: false,
    });
    return await this.notificationsRepository.save(notification);
  }

  async getNotificationsByUserId(userId: number): Promise<NotificationsTbl[]> {
    try {
      return await this.notificationsRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    } catch (err: any) {
      throw new Error(
        `Failed to fetch notifications for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async getUnreadCount(userId: number): Promise<number> {
    try {
      return await this.notificationsRepository.count({
        where: { userId, isRead: false },
      });
    } catch (err: any) {
      throw new Error(
        `Failed to count unread notifications for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async markAsRead(notificationId: number): Promise<NotificationsTbl> {
    try {
      const notification = await this.notificationsRepository.findOne({
        where: { notificationId },
      });
      if (!notification) {
        throw new NotFoundException('Notification not found');
      }
      notification.isRead = true;
      notification.readAt = new Date();
      return await this.notificationsRepository.save(notification);
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new Error(
        `Failed to mark notification as read: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async getNotificationById(notificationId: number): Promise<NotificationsTbl> {
    try {
      const notification = await this.notificationsRepository.findOne({
        where: { notificationId },
      });
      if (!notification) {
        throw new NotFoundException('Notification not found');
      }
      return notification;
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new Error(
        `Failed to fetch notification: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async deleteNotification(notificationId: number): Promise<void> {
    try {
      const result = await this.notificationsRepository.delete({
        notificationId,
      });
      if (!result.affected) {
        throw new NotFoundException('Notification not found');
      }
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new Error(
        `Failed to delete notification: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async markAllAsRead(userId: number): Promise<NotificationsTbl[]> {
    try {
      const notifications = await this.notificationsRepository.find({
        where: { userId, isRead: false },
      });

      if (notifications.length === 0) {
        return [];
      }

      const now = new Date();
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        isRead: true,
        readAt: now,
      }));

      return await this.notificationsRepository.save(updatedNotifications);
    } catch (err: any) {
      throw new Error(
        `Failed to mark all notifications as read for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
