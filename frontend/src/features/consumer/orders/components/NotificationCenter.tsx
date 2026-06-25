"use client";

import { useOrderNotifications } from "../hooks/useOrderNotifications";

interface NotificationCenterProps {
  userId: number | undefined;
}

/**
 * NotificationCenter
 * Displays unread notifications as toast messages in the top-right corner.
 * Automatically fetches and displays new notifications.
 * Replaces itself silently when new notifications arrive (no visible component).
 */
export function NotificationCenter({ userId }: NotificationCenterProps) {
  const { notifications } = useOrderNotifications(userId);

  // This component doesn't render anything visible.
  // It only manages the notification toast display in the background via useOrderNotifications hook
  return null;
}
