'use client';

import { X, ShoppingCart, User, DollarSign, Calendar, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { getStatusLabel } from "../../../../utils/statusMapper";
import { formatDateLong } from "../../../../utils/dateFormatter";
import type { SalesOrder } from "../../../../types/types";

interface OrderDetailsModalProps {
  isOpen: boolean;
  order: SalesOrder;
  onClose: () => void;
}

export function OrderDetailsModal({
  isOpen,
  order,
  onClose,
}: OrderDetailsModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, { bg: string; color: string }> = {
      PENDING_APPROVAL: { bg: "#fffbeb", color: "#d97706" },
      ACCEPT: { bg: "#dcfce7", color: "#16a34a" },
      DELIVERED: { bg: "#ecfdf5", color: "#16a34a" },
      PAID: { bg: "#f3f4f6", color: "#6b7280" },
      READY_FOR_BILLING: { bg: "#fef3c7", color: "#ca8a04" },
    };
    return statusColors[status] || { bg: "#f3f4f6", color: "#6b7280" };
  };

  const getPaymentMethodLabel = (method?: string) => {
    if (method === "paymongo" || method === "e-payment") {
      return "PayMongo";
    }
    return method === "manual_transfer" ? "Bank Transfer" : "N/A";
  };

  const statusColor = getStatusColor(order.status);
  const orderedProducts =
    order.orderedProducts && order.orderedProducts.length > 0
      ? order.orderedProducts
      : [{
          productId: order.productId,
          productName: "",
          quantity: order.quantity,
          unitPrice: order.unitPrice,
          totalPrice: order.totalPrice,
        }];
  const totalQuantity = orderedProducts.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotalBeforeDiscount =
    order.subtotalBeforeDiscount ?? orderedProducts.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const discountRate = order.discountRate ?? 0;
  const discountAmount = order.discountAmount ?? Math.round(subtotalBeforeDiscount * discountRate);
  const discountedSubtotal = order.discountedSubtotal ?? (subtotalBeforeDiscount - discountAmount);
  const deliveryFee = order.deliveryFee ?? 0;
  const payableTotal = order.payableTotal ?? order.grandTotal ?? order.totalPrice;

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
      />

      {/* Dialog */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 pointer-events-none" style={{ maxHeight: "100vh", maxWidth: "100vw" }}>
        <div
          className="rounded-2xl overflow-hidden w-full max-w-2xl pointer-events-auto flex flex-col"
          style={{
            background: "white",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            animation: isOpen
              ? "slideUp 0.3s ease-out"
              : "slideDown 0.2s ease-out forwards",
            maxHeight: "90vh",
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
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
              Order Details
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={18} color="#64748b" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1">
            {/* Order Header */}
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#fdf2f2" }}
              >
                <ShoppingCart size={28} style={{ color: "#bf262f" }} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }} className="truncate">
                  Order #{order.orderNumber}
                </h2>
                <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                  Order ID: <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{order.orderId}</span>
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3" style={{ paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>Status</span>
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: statusColor.bg,
                  color: statusColor.color,
                  border: `1px solid ${statusColor.color}30`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor.color }} />
                {getStatusLabel(order.status)}
              </span>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-2 gap-4 pb-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }} className="font-semibold">
                  Order Type
                </p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                  {order.orderType || "N/A"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }} className="font-semibold">
                  Payment Method
                </p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                  {getPaymentMethodLabel(order.paymentMethod)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }} className="font-semibold">
                  Delivery Status
                </p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                  {order.deliveryStatus || "Pending"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }} className="font-semibold">
                  Customer ID
                </p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                  {order.userId}
                </p>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
                Product Information
              </h3>
              <div className="space-y-3 p-4 rounded-lg" style={{ backgroundColor: "#f8fafc" }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563" }}>Total Quantity</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{totalQuantity} units</span>
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563", marginBottom: "8px" }}>
                    Products Ordered
                  </p>
                  <div className="space-y-2">
                    {orderedProducts.map((item, idx) => (
                      <div key={`${item.productId}-${idx}`} className="flex items-center justify-between rounded-md bg-white px-3 py-2">
                        <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: 600 }}>
                          {item.productName || `Product #${item.productId}`}
                        </span>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          Qty {item.quantity} · ₱{(item.totalPrice || 0).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Summary */}
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
                Pricing Summary
              </h3>
              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "#eff6ff",
                  borderLeft: "3px solid #2563eb",
                }}
              >
                <div className="space-y-2" style={{ marginBottom: "12px" }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563" }}>Subtotal</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                      ₱{subtotalBeforeDiscount.toLocaleString('en-PH')}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563" }}>
                        Discount ({Math.round(discountRate * 100)}%)
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#16a34a" }}>
                        -₱{discountAmount.toLocaleString('en-PH')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563" }}>After Discount</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                      ₱{discountedSubtotal.toLocaleString('en-PH')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563" }}>Delivery Fee</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: deliveryFee === 0 ? "#16a34a" : "#0f172a" }}>
                      {deliveryFee === 0 ? "FREE" : `₱${deliveryFee.toLocaleString('en-PH')}`}
                    </span>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #bfdbfe", paddingTop: "10px" }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#4b5563" }}>Total Payable</span>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: "#2563eb" }}>
                    ₱{payableTotal.toLocaleString('en-PH')}
                  </span>
                </div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg" style={{ backgroundColor: "#f8fafc" }}>
              <div>
                <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }} className="font-semibold">
                  Created
                </p>
                <p style={{ fontSize: "13px", color: "#0f172a", fontWeight: 600 }}>
                  {formatDateLong(order.createdAt)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }} className="font-semibold">
                  Last Updated
                </p>
                <p style={{ fontSize: "13px", color: "#0f172a", fontWeight: 600 }}>
                  {formatDateLong(order.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4" style={{ borderTop: "1px solid #f1f5f9" }}>
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: "#bf262f" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
