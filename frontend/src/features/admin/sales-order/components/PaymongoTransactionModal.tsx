'use client';

import { X, AlertCircle, CheckCircle, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDateWithTime } from "@/utils/dateFormatter";
import {
  STATUS_FLOW,
  STATUS_LABELS,
} from "@/features/admin/sales-order/constants/statusFlow";
import type { SalesOrder } from "@/types/types";

interface PaymongoTransactionModalProps {
  isOpen: boolean;
  order: SalesOrder;
  onClose: () => void;
  onUpdateStatus: (order: SalesOrder, nextStatus: string) => Promise<void> | void;
  onReportDiscrepancy: (order: SalesOrder) => Promise<void> | void;
  isLoading?: boolean;
}

export function PaymongoTransactionModal({
  isOpen,
  order,
  onClose,
  onUpdateStatus,
  onReportDiscrepancy,
  isLoading = false,
}: PaymongoTransactionModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setSelectedStatus(null);
    }
  }, [isOpen, order.orderId]);

  if (!isOpen && !isAnimating) return null;
  const expectedAmount = order.grandTotal ?? order.totalPrice;
  const chargedAmount = order.paymongoAmount || 0;
  const amountMatch = Math.abs(expectedAmount - chargedAmount) < 0.01;
  const amountDifference = chargedAmount - expectedAmount;
  const statusOptions = (STATUS_FLOW[order.status || ""] || []).filter(
    (status) => status !== "REJECTED" && status !== "CANCELLED",
  );
  const canUpdateStatus = amountMatch && statusOptions.length > 0;

  const paymentMethodDisplay: Record<string, string> = {
    card: "Credit/Debit Card",
    gcash: "GCash",
    grab_pay: "Grab Pay",
    paymaya: "PayMaya",
    bank_transfer: "Bank Transfer",
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

      {/* Dialog */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 pointer-events-none" style={{ maxHeight: "100vh", maxWidth: "100vw" }}>
        <div
          className="rounded-2xl overflow-hidden w-full max-w-lg pointer-events-auto"
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
              PayMongo Transaction Details
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
          {/* Amount Verification */}
          <div
            className="rounded-lg p-4"
            style={{
              background: amountMatch ? "#ecfdf5" : "#fef2f2",
              border: `1px solid ${amountMatch ? "#bbf7d0" : "#fecaca"}`,
            }}
          >
            <div className="flex items-start gap-3">
              {amountMatch ? (
                <CheckCircle size={20} color="#16a34a" style={{ flexShrink: 0 }} />
              ) : (
                <AlertCircle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
              )}
              <div className="flex-1">
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: amountMatch ? "#16a34a" : "#dc2626",
                    marginBottom: "4px",
                  }}
                >
                  {amountMatch ? "Amount Match ✓" : "Amount Discrepancy ⚠"}
                </p>
                <p style={{ fontSize: "12px", color: amountMatch ? "#16a34a" : "#dc2626" }}>
                  Expected: ₱{expectedAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })} | Charged: ₱
                  {chargedAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </p>
                {!amountMatch && (
                  <p style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px" }}>
                    Difference: {amountDifference > 0 ? "+" : ""}₱
                    {Math.abs(amountDifference).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {canUpdateStatus && (
            <div className="space-y-3">
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Update Order Status
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setSelectedStatus(status)}
                    className="w-full text-left rounded-xl border px-4 py-3 transition-all"
                    style={{
                      borderColor:
                        selectedStatus === status ? "#0f172a" : "#e2e8f0",
                      background:
                        selectedStatus === status ? "#0f172a" : "#f8fafc",
                      color:
                        selectedStatus === status ? "white" : "#0f172a",
                      opacity: isLoading ? 0.6 : 1,
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ fontWeight: 600, fontSize: "13px" }}>
                        {STATUS_LABELS[status] || status}
                      </span>
                      <ArrowUpRight size={14} />
                    </div>
                    <p
                      style={{
                        fontSize: "11px",
                        marginTop: "4px",
                        color: selectedStatus === status ? "#f1f5f9" : "#64748b",
                      }}
                    >
                      Apply this status immediately
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transaction Details */}
          <div className="space-y-3">
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Transaction Information
            </p>

            <div
              className="rounded-lg overflow-hidden"
              style={{ border: "1px solid #f1f5f9" }}
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid #f8fafc" }}
              >
                <p style={{ fontSize: "12px", color: "#64748b" }}>Transaction ID</p>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#0f172a",
                    fontFamily: "monospace",
                  }}
                >
                  {order.paymongoTransactionId}
                </p>
              </div>

              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid #f8fafc" }}
              >
                <p style={{ fontSize: "12px", color: "#64748b" }}>Payment Method</p>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#0f172a" }}>
                  {paymentMethodDisplay[order.paymongoPaymentMethod || "card"] ||
                    order.paymongoPaymentMethod}
                </p>
              </div>

              <div className="flex items-center justify-between px-4 py-3">
                <p style={{ fontSize: "12px", color: "#64748b" }}>Timestamp</p>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#0f172a" }}>
                  {order.paymongoTimestamp
                    ? formatDateWithTime(order.paymongoTimestamp)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex gap-3"
          style={{ borderTop: "1px solid #f1f5f9" }}
        >
          {!amountMatch && (
            <button
              onClick={() => onReportDiscrepancy(order)}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-lg transition-all"
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontSize: "13px",
                fontWeight: 600,
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Processing..." : "Report Discrepancy"}
            </button>
          )}

          {canUpdateStatus && (
            <button
              onClick={() =>
                selectedStatus && onUpdateStatus(order, selectedStatus)
              }
              disabled={
                isLoading || !selectedStatus || !amountMatch || !canUpdateStatus
              }
              className="flex-1 py-2.5 rounded-lg transition-all"
              style={{
                background: selectedStatus ? "#0f172a" : "#f1f5f9",
                border: selectedStatus ? "1px solid #0f172a" : "1px solid #e2e8f0",
                color: selectedStatus ? "#fff" : "#94a3b8",
                fontSize: "13px",
                fontWeight: 600,
                opacity: isLoading ? 0.6 : 1,
                cursor:
                  isLoading || !selectedStatus ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Updating..." : "Apply Status Update"}
            </button>
          )}

          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-lg transition-all"
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: 600,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            Close
          </button>
        </div>
        </div>
      </div>
    </>
  );
}
