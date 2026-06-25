// notificationService.ts

import { api } from "@/lib/api";

export interface Notification {
  notificationId: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  orderId?: number;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  metadata?: string;
}

export const notificationService = {
  getNotifications: async () => {
    return api.get("notifications").json<Notification[]>();
  },

  getUnreadCount: async () => {
    return api.get("notifications/unread-count").json<number>();
  },

  markAsRead: async (notificationId: number) => {
    return api
      .patch(`notifications/${notificationId}/read`)
      .json<Notification>();
  },

  markAllAsRead: async () => {
    return api.patch("notifications/read-all").json<Notification[]>();
  },

  deleteNotification: async (notificationId: number) => {
    return api.delete(`notifications/${notificationId}`).json();
  },
};