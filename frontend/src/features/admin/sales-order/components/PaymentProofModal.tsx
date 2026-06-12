'use client';

import { X, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDateWithTime } from "@/utils/dateFormatter";
import { SalesOrder } from "../../../../types/types";

interface PaymentProofModalProps {
  isOpen: boolean;
  order: SalesOrder;
  onClose: () => void;
  onApprove: (order: SalesOrder) => void;
  onReject: (order: SalesOrder, reason?: string) => void;
  isLoading?: boolean;
}

export function PaymentProofModal({
  isOpen,
  order,
  onClose,
  onApprove,
  onReject,
  isLoading = false,
}: PaymentProofModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const canApproveCurrentStatus = order.status === "AWAITING_PAYMENT_VERIFICATION";

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setShowRejectReason(false);
      setRejectionReason("");
      setReasonError("");
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleRejectClick = () => {
    setShowRejectReason(true);
  };

  const handleSubmitReject = () => {
    if (!rejectionReason.trim()) {
      setReasonError("Please provide a reason for rejection");
      return;
    }

    if (rejectionReason.trim().length < 10) {
      setReasonError("Reason must be at least 10 characters");
      return;
    }

    onReject(order, rejectionReason.trim());
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
      ></div>

      {/* Dialog */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 pointer-events-none" style={{ maxHeight: "100vh", maxWidth: "100vw" }}>
        <div
          className="rounded-2xl overflow-hidden w-full max-w-2xl pointer-events-auto"
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
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid #f1f5f9" }}
        >
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Payment Proof Verification
            </h3>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>
              Order #{order.orderNumber} • Customer #{order.userId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-slate-100"
            disabled={isLoading}
          >
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Image Display */}
          {order.paymentProofImage ? (
            <div className="w-full">
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "12px",
                }}
              >
                Uploaded Proof
              </p>
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  maxHeight: "400px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={order.paymentProofImage}
                  alt="Payment proof"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                />
              </div>
              {order.paymentProofUploadedAt && (
                <p
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    marginTop: "8px",
                  }}
                >
                  Uploaded: {formatDateWithTime(order.paymentProofUploadedAt)}
                </p>
              )}
            </div>
          ) : (
            <div
              className="rounded-lg p-8 text-center"
              style={{
                border: "1px solid #f1f5f9",
                background: "#f8fafc",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                }}
              >
                No payment proof image available
              </p>
            </div>
          )}

          {/* Instructions */}
          <div
            className="rounded-lg p-4"
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#1e40af",
                marginBottom: "6px",
              }}
            >
              ℹ️ Verification Instructions
            </p>
            <ul
              style={{
                fontSize: "12px",
                color: "#1e40af",
                lineHeight: "1.6",
              }}
            >
              <li>• Verify the amount matches the order total</li>
              <li>• Check the sender details match the customer</li>
              <li>• Confirm the transaction date is recent</li>
              <li>• Look for any signs of forgery or manipulation</li>
            </ul>
          </div>

          {/* Rejection Reason - Inline */}
          {showRejectReason && (
            <div
              className="rounded-lg p-4"
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
              }}
            >
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#dc2626",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (reasonError) setReasonError("");
                }}
                disabled={isLoading}
                placeholder="e.g., Signature doesn't match, Amount discrepancy, Sender not authorized, Suspicious transaction..."
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-all resize-none"
                rows={3}
                style={{
                  borderColor: reasonError ? "#dc2626" : "#e2e8f0",
                  backgroundColor: "#f8fafc",
                  fontFamily: "inherit",
                }}
              />
              {reasonError && (
                <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "6px" }}>
                  {reasonError}
                </p>
              )}
              <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>
                {rejectionReason.length}/200 characters (min 10 required)
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 space-y-3"
          style={{ borderTop: "1px solid #f1f5f9" }}
        >
          {/* Show status if rejected or approved */}
          {(order.paymentProofStatus === 'rejected' || order.paymentProofStatus === 'approved') && (
            <div className={`p-3 rounded-lg border-l-4 ${
              order.paymentProofStatus === 'rejected' 
                ? 'bg-red-50 border-red-600' 
                : 'bg-green-50 border-green-600'
            }`}>
              <p style={{
                fontSize: "12px",
                fontWeight: 600,
                color: order.paymentProofStatus === 'rejected' ? "#dc2626" : "#16a34a",
                marginBottom: "4px"
              }}>
                {order.paymentProofStatus === 'rejected' ? '❌ Rejected' : '✅ Approved'}
              </p>
              {order.paymentProofStatus === 'rejected' && order.paymentProofRejectionReason && (
                <p style={{
                  fontSize: "12px",
                  color: "#991b1b",
                  lineHeight: "1.4",
                  marginBottom: "6px"
                }}>
                  {order.paymentProofRejectionReason}
                </p>
              )}
              <p style={{
                fontSize: "11px",
                color: order.paymentProofStatus === 'rejected' ? "#b91c1c" : "#15803d"
              }}>
                Attempts: {order.paymentProofAttempts || 0}/3
              </p>
              {order.paymentProofStatus === 'rejected' && (
                <p style={{
                  fontSize: "11px",
                  color: "#991b1b",
                  marginTop: "6px",
                  fontWeight: 500
                }}>
                  ⚠️ Client must re-upload new proof
                </p>
              )}
            </div>
          )}

          {!showRejectReason ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleRejectClick}
                  disabled={isLoading || order.paymentProofStatus === 'rejected' || order.paymentProofStatus === 'approved' || !order.paymentProofImage}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: order.paymentProofStatus === 'rejected' || order.paymentProofStatus === 'approved' || !order.paymentProofImage 
                      ? "#f1f5f9" 
                      : "#fee2e2",
                    border: order.paymentProofStatus === 'rejected' || order.paymentProofStatus === 'approved' || !order.paymentProofImage 
                      ? "1px solid #e2e8f0" 
                      : "1px solid #fecaca",
                    color: order.paymentProofStatus === 'rejected' || order.paymentProofStatus === 'approved' || !order.paymentProofImage 
                      ? "#94a3b8" 
                      : "#dc2626",
                  }}
                  title={order.paymentProofStatus === 'rejected' ? "This proof has been rejected - waiting for new upload" : order.paymentProofStatus === 'approved' ? "This proof has been approved" : !order.paymentProofImage ? "Waiting for client to upload proof" : ""}
                >
                  <XCircle size={14} />
                  <span>{isLoading ? "Processing..." : "Reject"}</span>
                </button>

                <button
                  onClick={() => onApprove(order)}
                  disabled={isLoading || !order.paymentProofImage || order.paymentProofStatus === 'rejected' || order.paymentProofStatus === 'approved' || !canApproveCurrentStatus}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: order.paymentProofStatus === 'approved' 
                      ? "#dcfce7" 
                      : (order.paymentProofStatus === 'rejected' || !order.paymentProofImage || !canApproveCurrentStatus ? "#f1f5f9" : "#dcfce7"),
                    border: order.paymentProofStatus === 'approved' 
                      ? "1px solid #bbf7d0" 
                      : (order.paymentProofStatus === 'rejected' || !order.paymentProofImage || !canApproveCurrentStatus ? "1px solid #e2e8f0" : "1px solid #bbf7d0"),
                    color: order.paymentProofStatus === 'approved' 
                      ? "#16a34a" 
                      : (order.paymentProofStatus === 'rejected' || !order.paymentProofImage || !canApproveCurrentStatus ? "#94a3b8" : "#16a34a"),
                  }}
                  title={order.paymentProofStatus === 'approved'
                    ? "This proof has been approved"
                    : order.paymentProofStatus === 'rejected'
                      ? "This proof has been rejected"
                      : !order.paymentProofImage
                        ? "Waiting for client to upload proof"
                        : !canApproveCurrentStatus
                          ? "Payment proof can only be approved from Awaiting Payment Verification"
                          : ""}
                >
                  <CheckCircle size={14} />
                  <span>
                    {order.paymentProofStatus === 'approved' 
                      ? "Approved" 
                      : order.paymentProofStatus === 'rejected' 
                        ? "Rejected" 
                        : (isLoading ? "Processing..." : "Accept")}
                  </span>
                </button>
              </div>

              <button
                onClick={onClose}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  color: "#64748b",
                }}
              >
                Close
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowRejectReason(false)}
                  disabled={isLoading}
                  className="py-2.5 px-4 rounded-lg font-semibold text-sm transition-all hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    color: "#64748b",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReject}
                  disabled={isLoading || !rejectionReason.trim()}
                  className="py-2.5 px-4 rounded-lg font-semibold text-sm transition-all hover:shadow-sm text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: (isLoading || !rejectionReason.trim()) ? "#b91c1c" : "#dc2626",
                    border: "1px solid #dc2626",
                  }}
                >
                  {isLoading ? "Rejecting..." : "Confirm"}
                </button>
              </div>
            </>
          )}
        </div>
        </div>
      </div>
    </>
  );
}
