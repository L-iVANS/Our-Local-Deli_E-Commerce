"use client";

import { AlertCircle } from "lucide-react";
import type { Order } from "../../types/order";

interface CancelOrderModalProps {
  isOpen: boolean;
  order: Order;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CancelOrderModal({
  isOpen,
  order,
  isLoading,
  onConfirm,
  onCancel,
}: CancelOrderModalProps) {
  if (!isOpen) return null;

  const items = order.items;
  const itemsList = items.map((item) => `${item.name} (×${item.qty})`).join(", ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
              <AlertCircle size={24} className="text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">
            Cancel Order?
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-sm text-center mb-4">
            Are you sure you want to cancel{" "}
            <span className="font-semibold text-gray-800">
              Order {order.sapSo}, {itemsList}
            </span>
            ?
          </p>

          {/* Warning */}
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              This action cannot be undone. The order will be marked as cancelled.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-lg font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Cancelling..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
