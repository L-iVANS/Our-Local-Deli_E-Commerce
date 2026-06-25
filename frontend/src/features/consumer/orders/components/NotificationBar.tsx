"use client";

import { useOrderNotifications } from "../hooks/useOrderNotifications";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { useState } from "react";

interface NotificationBarProps {
  userId: number | undefined;
}

interface DisplayNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  orderId?: number;
  dismissed: boolean;
}

/**
 * NotificationBar - Displays notifications at the top like Facebook
 * Shows persistent notifications for payment proof rejections/approvals
 */
export function NotificationBar({ userId }: NotificationBarProps) {
  const { notifications } = useOrderNotifications(userId);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  // Get unread notifications that haven't been dismissed
  const visibleNotifications = notifications.filter(
    (n) => !n.isRead && !dismissed.has(n.notificationId)
  );

  if (!visibleNotifications.length) return null;

  const handleDismiss = (notificationId: number) => {
    setDismissed((prev) => {
      const updated = new Set(prev);
      updated.add(notificationId);
      return updated;
    });
  };

  return (
    <div className="w-full bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="space-y-2">
          {visibleNotifications.map((notification) => (
            <div
              key={notification.notificationId}
              className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${
                notification.type === "payment_proof_rejected"
                  ? "bg-red-50 border-l-red-500"
                  : notification.type === "payment_proof_approved"
                  ? "bg-green-50 border-l-green-500"
                  : "bg-blue-50 border-l-blue-500"
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 pt-0.5">
                {notification.type === "payment_proof_rejected" ? (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                ) : notification.type === "payment_proof_approved" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    notification.type === "payment_proof_rejected"
                      ? "text-red-900"
                      : notification.type === "payment_proof_approved"
                      ? "text-green-900"
                      : "text-blue-900"
                  }`}
                >
                  {notification.title}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    notification.type === "payment_proof_rejected"
                      ? "text-red-800"
                      : notification.type === "payment_proof_approved"
                      ? "text-green-800"
                      : "text-blue-800"
                  }`}
                >
                  {notification.message}
                </p>
                {notification.orderId && (
                  <p
                    className={`text-xs mt-2 font-medium ${
                      notification.type === "payment_proof_rejected"
                        ? "text-red-700"
                        : notification.type === "payment_proof_approved"
                        ? "text-green-700"
                        : "text-blue-700"
                    }`}
                  >
                    Order #{notification.orderId}
                  </p>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => handleDismiss(notification.notificationId)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
