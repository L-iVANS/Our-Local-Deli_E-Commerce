"use client";

import { useRef, useEffect } from "react";
import { Upload, CreditCard } from "lucide-react";
import type { Order } from "../../types/order";

interface OrderRowMenuProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onCancelOrder: () => void;
  onUploadPayment: () => void;
  onPayNow: () => void;
  onViewDetails: () => void;
  isExpanded: boolean;
  onShowCancelModal: () => void;
}

export function OrderRowMenu({
  isOpen,
  onClose,
  order,
  onCancelOrder,
  onUploadPayment,
  onPayNow,
  onViewDetails,
  isExpanded,
  onShowCancelModal,
}: OrderRowMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Allow cancel only before processing begins.
  const cancellableStatuses = [
    "PENDING_APPROVAL",
    "READY_FOR_BILLING",
    "AWAITING_PAYMENT_VERIFICATION",
  ];
  const canCancel = cancellableStatuses.includes(order.status);
  const canUploadPayment =
    order.status === "PENDING_APPROVAL" ||
    order.status === "READY_FOR_BILLING";
  
  // Check if this is an e-payment order
  const isEPaymentOrder = order.paymentMethod === "e-payment";
  const isManualTransferOrder = order.paymentMethod === "manual_transfer";
  
  // Show "Pay Now" for e-payment orders, "Upload Proof" for manual transfer
  const shouldShowPayNow = isEPaymentOrder && canCancel;
  const shouldShowUploadProof = isManualTransferOrder && canUploadPayment;

  return (
    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50" ref={menuRef}>
      <div className="py-1">
        {shouldShowPayNow && (
          <>
            <button
              onClick={onPayNow}
              className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors flex items-center gap-2 font-semibold"
            >
              <CreditCard size={16} />
              Pay Now
            </button>
            <button
              onClick={onViewDetails}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isExpanded ? "Close Details" : "View Details"}
            </button>
          </>
        )}

        {shouldShowUploadProof && (
          <>
            <button
              onClick={onUploadPayment}
              className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-2 font-semibold"
            >
              <Upload size={16} />
              Upload Payment Proof
            </button>
            <button
              onClick={onViewDetails}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isExpanded ? "Close Details" : "View Details"}
            </button>
          </>
        )}

        {!shouldShowPayNow && !shouldShowUploadProof && (
          <>
            {canCancel && (
              <>
                <button
                  onClick={() => {
                    onShowCancelModal();
                    onClose();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel Order
                </button>

                {canUploadPayment && (
                  <button
                    onClick={onUploadPayment}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Upload size={16} />
                    Upload Payment Proof
                  </button>
                )}
              </>
            )}

            <button
              onClick={onViewDetails}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isExpanded ? "Close Details" : "View Details"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
