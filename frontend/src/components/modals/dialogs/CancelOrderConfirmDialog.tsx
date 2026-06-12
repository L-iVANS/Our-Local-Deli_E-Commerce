'use client';

import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface CancelOrderConfirmDialogProps {
  isOpen: boolean;
  orderNumber: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CancelOrderConfirmDialog({
  isOpen,
  orderNumber,
  onConfirm,
  onCancel,
  isLoading = false,
}: CancelOrderConfirmDialogProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

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
        onClick={onCancel}
        onAnimationEnd={() => {
          if (!isOpen) setIsAnimating(false);
        }}
      />

      {/* Dialog */}
      <div
        className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        style={{ maxHeight: "100vh", maxWidth: "100vw" }}
      >
        <div
          className="rounded-2xl overflow-hidden w-full max-w-sm pointer-events-auto"
          style={{
            background: "white",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
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
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes fadeOut {
              from {
                opacity: 1;
              }
              to {
                opacity: 0;
              }
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
          <div className="px-6 py-4 w-full" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#fef2f2" }}
              >
                <AlertCircle size={20} style={{ color: "#dc2626" }} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                Cancel Order?
              </h3>
            </div>
            <p style={{ 
              fontSize: "14px", 
              color: "#64748b", 
              marginTop: "8px", 
              lineHeight: "1.6",
              whiteSpace: "normal",
              wordWrap: "break-word",
              width: "100%"
            }}>
              You're about to cancel order <strong>#{orderNumber}</strong>. This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop: "1px solid #f1f5f9" }}>
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Keep Order
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
              style={{
                backgroundColor: isLoading ? "#dc2626cc" : "#dc2626",
              }}
            >
              {isLoading ? "Canceling..." : "Cancel Order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
