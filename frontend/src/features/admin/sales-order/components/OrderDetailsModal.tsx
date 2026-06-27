'use client';

import { X, ShoppingCart } from "lucide-react";
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
    if (isOpen) setIsAnimating(true);
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  // ✅ Theme-aware status colors
  const getStatusTheme = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return {
          bg: "bg-accent/15 dark:bg-accent/25",
          text: "text-accent dark:text-gold-light",
          border: "border-accent/30 dark:border-gold/40",
          dot: "bg-accent",
        };
      case "ACCEPT":
      case "DELIVERED":
        return {
          bg: "bg-primary/10 dark:bg-primary/25",
          text: "text-primary dark:text-gold-light",
          border: "border-primary/30 dark:border-gold/40",
          dot: "bg-primary",
        };
      case "READY_FOR_BILLING":
        return {
          bg: "bg-accent/15 dark:bg-accent/25",
          text: "text-accent dark:text-gold-light",
          border: "border-accent/30 dark:border-gold/40",
          dot: "bg-accent",
        };
      case "PAID":
      default:
        return {
          bg: "bg-gray-100 dark:bg-sidebar-accent",
          text: "text-gray-600 dark:text-muted-foreground",
          border: "border-gray-200 dark:border-sidebar-border",
          dot: "bg-gray-400",
        };
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    if (method === "paymongo" || method === "e-payment") return "PayMongo";
    return method === "manual_transfer" ? "Bank Transfer" : "N/A";
  };

  const statusTheme = getStatusTheme(order.status);

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
        className="fixed top-0 left-0 w-screen h-screen z-40 bg-black/50"
        style={{
          animation: isOpen
            ? "fadeIn 0.2s ease-out"
            : "fadeOut 0.2s ease-out forwards",
        }}
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="rounded-2xl overflow-hidden w-full max-w-2xl pointer-events-auto flex flex-col
                     max-h-[90vh]
                     bg-white dark:bg-card
                     border border-gray-200 dark:border-sidebar-border
                     shadow-2xl"
          style={{
            animation: isOpen
              ? "slideUp 0.3s ease-out"
              : "slideDown 0.2s ease-out forwards",
          }}
          onAnimationEnd={() => { if (!isOpen) setIsAnimating(false); }}
        >
          <style>{`
            @keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 } }
            @keyframes fadeOut  { from { opacity: 1 } to { opacity: 0 } }
            @keyframes slideUp  { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
            @keyframes slideDown{ from { opacity: 1; transform: translateY(0)   } to { opacity: 0; transform: translateY(20px) } }
          `}</style>

          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between
                          border-b border-gray-200 dark:border-sidebar-border
                          bg-primary/5 dark:bg-primary/20">
            <h3 className="font-serif text-lg font-semibold text-primary dark:text-gold-light">
              Order Details
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors
                         text-gray-500 hover:text-gray-800 hover:bg-gray-200
                         dark:text-muted-foreground dark:hover:text-gold dark:hover:bg-sidebar-accent"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1">
            {/* Order Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0
                              bg-primary/10 dark:bg-primary/25
                              border border-primary/20 dark:border-gold/30">
                <ShoppingCart size={28} className="text-primary dark:text-gold-light" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-xl font-semibold truncate text-gray-900 dark:text-gold-light">
                  Order #{order.orderNumber}
                </h2>
                <p className="text-sm mt-1 text-gray-500 dark:text-muted-foreground">
                  Order ID: <span className="font-mono font-semibold text-gray-700 dark:text-gold">{order.orderId}</span>
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-sidebar-border">
              <span className="text-xs font-semibold text-gray-400 dark:text-muted-foreground">Status</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusTheme.bg} ${statusTheme.text} ${statusTheme.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusTheme.dot}`} />
                {getStatusLabel(order.status)}
              </span>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200 dark:border-sidebar-border">
              {[
                { label: "Order Type", value: order.orderType || "N/A" },
                { label: "Payment Method", value: getPaymentMethodLabel(order.paymentMethod) },
                { label: "Delivery Status", value: order.deliveryStatus || "Pending" },
                { label: "Customer ID", value: order.userId },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-semibold mb-1.5 text-gray-400 dark:text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gold">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Product Details */}
            <div>
              <h3 className="font-serif text-base font-semibold mb-3 text-primary dark:text-gold-light">
                Product Information
              </h3>
              <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-input-background">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gold">Total Quantity</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gold">{totalQuantity} units</span>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gold">Products Ordered</p>
                  <div className="space-y-2">
                    {orderedProducts.map((item, idx) => (
                      <div
                        key={`${item.productId}-${idx}`}
                        className="flex items-center justify-between rounded-md px-3 py-2
                                   bg-white dark:bg-card
                                   border border-gray-100 dark:border-sidebar-border"
                      >
                        <span className="text-sm font-semibold text-gray-900 dark:text-gold-light">
                          {item.productName || `Product #${item.productId}`}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-muted-foreground">
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
              <h3 className="font-serif text-base font-semibold mb-3 text-primary dark:text-gold-light">
                Pricing Summary
              </h3>
              <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5 dark:bg-primary/15">
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600 dark:text-muted-foreground">Subtotal</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gold">₱{subtotalBeforeDiscount.toLocaleString('en-PH')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-600 dark:text-muted-foreground">
                        Discount ({Math.round(discountRate * 100)}%)
                      </span>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        -₱{discountAmount.toLocaleString('en-PH')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600 dark:text-muted-foreground">After Discount</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gold">₱{discountedSubtotal.toLocaleString('en-PH')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600 dark:text-muted-foreground">Delivery Fee</span>
                    <span className={`text-sm font-semibold ${deliveryFee === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gold'}`}>
                      {deliveryFee === 0 ? "FREE" : `₱${deliveryFee.toLocaleString('en-PH')}`}
                    </span>
                  </div>
                </div>
                <div className="border-t border-primary/20 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700 dark:text-gold">Total Payable</span>
                    <span className="text-lg font-bold text-primary dark:text-gold-light">₱{payableTotal.toLocaleString('en-PH')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50 dark:bg-input-background">
              <div>
                <p className="text-[11px] font-semibold mb-1 text-gray-400 dark:text-muted-foreground">Created</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gold">{formatDateLong(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold mb-1 text-gray-400 dark:text-muted-foreground">Last Updated</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gold">{formatDateLong(order.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-sidebar-border">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all
                         bg-primary text-[#F4F4F0] shadow-sm
                         hover:bg-primary/90 hover:shadow-md
                         focus:outline-none focus:ring-2 focus:ring-primary/30
                         active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}