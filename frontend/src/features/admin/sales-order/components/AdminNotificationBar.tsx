"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { X, Bell, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { GET_NOTIFICATIONS } from "../../../b2b/orders/services/query";

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

interface NotificationPanelProps {
  userId: number | undefined;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * NotificationPanel - Shows notifications in a drawer/modal like Facebook/Slack
 * Displays list of notifications with status, timestamps, and mark as read
 */
export function NotificationPanel({ userId, isOpen, onClose }: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<"Direct" | "Watching">("Direct");

  const { data, loading } = useQuery<{
    getNotificationsByUserId: Notification[];
  }>(GET_NOTIFICATIONS, {
    skip: !userId || !isOpen,
  });

  const notifications = data?.getNotificationsByUserId || [];

  const getStatusBadge = (type: string) => {
    switch (type) {
      case "payment_proof_rejected":
        return {
          label: "Action needed",
          color: "bg-red-100 text-red-700",
          icon: AlertCircle,
        };
      case "payment_proof_approved":
        return {
          label: "Completed",
          color: "bg-green-100 text-green-700",
          icon: CheckCircle,
        };
      case "order_status_change":
        return {
          label: "In progress",
          color: "bg-blue-100 text-blue-700",
          icon: Clock,
        };
      default:
        return {
          label: "New",
          color: "bg-gray-100 text-gray-700",
          icon: Bell,
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }

    return date.toLocaleDateString("en-US", { 
      weekday: "short", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Mark all as read */}
        <div className="px-6 py-2 border-b border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Mark all as read
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200">
          {(["Direct", "Watching"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "text-gray-900 border-blue-500"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <Bell className="h-8 w-8 text-gray-300" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => {
                const status = getStatusBadge(notification.type);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={notification.notificationId}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {/* Notification content */}
                    <div className="flex gap-3">
                      {/* Status indicator */}
                      <div className={`flex-shrink-0 p-2 rounded ${status.color}`}>
                        <StatusIcon className="h-4 w-4" />
                      </div>

                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        {/* Order number and status */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {notification.orderId ? `${notification.orderId}` : "System"}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>

                        {/* Title */}
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {notification.title}
                        </p>

                        {/* Message preview */}
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>

                        {/* Timestamp */}
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
