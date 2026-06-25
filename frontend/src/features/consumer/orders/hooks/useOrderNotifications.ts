"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";

interface Notification {
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

export function useOrderNotifications() {
  const [shownNotifications, setShownNotifications] = useState<Set<number>>(
    new Set()
  );

  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
    refetchInterval: 30000,
  });

  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (n) => !n.isRead && !shownNotifications.has(n.notificationId)
    );

    unreadNotifications.forEach((notification) => {
      setShownNotifications((prev) => {
        const updated = new Set(prev);
        updated.add(notification.notificationId);
        return updated;
      });
    });
  }, [notifications, shownNotifications]);

  return {
    notifications,
    loading: isLoading,
    refetch,
  };
}