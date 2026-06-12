'use client';

import { X, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  STATUS_FLOW,
  STATUS_LABELS,
  STATUS_COLORS,
} from "@/features/admin/sales-order/constants/statusFlow";

interface UpdateOrderStatusModalProps {
  isOpen: boolean;
  orderNumber: string;
  currentStatus: string;
  onClose: () => void;
  onUpdate: (newStatus: string) => Promise<void>;
  isLoading?: boolean;
}

const FALLBACK_COLOR = { bg: "#f3f4f6", color: "#6b7280" };

export function UpdateOrderStatusModal({
  isOpen,
  orderNumber,
  currentStatus,
  onClose,
  onUpdate,
  isLoading = false,
}: UpdateOrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setSelectedStatus("");
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const availableStatuses = STATUS_FLOW[currentStatus as keyof typeof STATUS_FLOW] || [];

  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    setLoading(true);

    try {
      await onUpdate(selectedStatus);
      toast.success(`Order now in ${STATUS_LABELS[selectedStatus]} status`);
      onClose();
    } catch (err) {
      toast.error("Failed to update order status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed top-0 left-0 w-screen h-screen z-40"
        style={{
          background: "rgba(0,0,0,0.5)",
          animation: isOpen
            ? "fadeIn 0.2s ease-out"
            : "fadeOut 0.2s ease-out forwards",
        }}
        onClick={onClose}
        onAnimationEnd={() => {
          if (!isOpen) setIsAnimating(false);
        }}
      />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 pointer-events-none" style={{ maxHeight: "100vh", maxWidth: "100vw" }}>
        <div
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto"
          style={{
            animation: isOpen
              ? "slideUp 0.3s ease-out"
              : "slideDown 0.2s ease-out forwards",
          }}
          onAnimationEnd={() => {
            if (!isOpen) setIsAnimating(false);
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes slideDown {
              from {
                opacity: 1;
                transform: translateY(0);
              }
              to {
                opacity: 0;
                transform: translateY(20px);
              }
            }
          `}</style>

          {/* Header */}
          <div
            className="px-6 py-4 border-b border-gray-100 flex items-center justify-between"
            style={{ backgroundColor: "#fdf2f2" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#fff4f4" }}
              >
                <Package size={20} style={{ color: "#bf262f" }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Update Order Status</h2>
                <p className="text-xs text-gray-500">{orderNumber}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Current Status */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Current Status</p>
              <div
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-center"
                style={STATUS_COLORS[currentStatus] || FALLBACK_COLOR}
              >
                {STATUS_LABELS[currentStatus] || currentStatus}
              </div>
            </div>

            {/* Available Statuses */}
            {availableStatuses.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Select New Status</p>
                <div className="space-y-2">
                  {availableStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all text-left"
                      style={{
                        borderColor: selectedStatus === status ? (STATUS_COLORS[status]?.color || FALLBACK_COLOR.color) : "#e5e7eb",
                        backgroundColor:
                          selectedStatus === status
                            ? STATUS_COLORS[status]?.bg || FALLBACK_COLOR.bg
                            : "white",
                        color: selectedStatus === status ? (STATUS_COLORS[status]?.color || FALLBACK_COLOR.color) : "#6b7280",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.6 : 1,
                      }}
                    >
                      {STATUS_LABELS[status] || status}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="px-4 py-3 rounded-lg text-sm text-gray-600"
                style={{ backgroundColor: "#f3f4f6" }}
              >
                No status changes available for this order
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-6 py-4 flex items-center justify-end gap-3"
            style={{ borderTop: "1px solid #f1f5f9" }}
          >
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
              style={{
                borderColor: "#e2e8f0",
                color: "#4b5563",
                backgroundColor: "#f8fafc",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedStatus}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
              style={{
                backgroundColor: "#bf262f",
                cursor: loading || !selectedStatus ? "not-allowed" : "pointer",
                opacity: loading || !selectedStatus ? 0.6 : 1,
              }}
            >
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
