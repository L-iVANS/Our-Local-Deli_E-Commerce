"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { OrderRowMenu } from "./OrderRowMenu";
import { CancelOrderModal } from "./CancelOrderModal";

interface OrderRowActionsProps {
  order: any;
  isExpanded: boolean;
  onExpand: (orderId: string | null) => void;
  onCancelOrder: () => void;
  onUploadPayment: () => void;
  onPayNow: () => void;
}

export function OrderRowActions({
  order,
  isExpanded,
  onExpand,
  onCancelOrder,
  onUploadPayment,
  onPayNow,
}: OrderRowActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      await onCancelOrder();
      setShowCancelModal(false);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <div className="flex sm:flex-row sm:items-center sm:gap-3 sm:shrink-0 absolute sm:relative top-3 right-3 sm:top-auto sm:right-auto">
        <div className="hidden sm:block text-right">
          <div className="font-bold text-gray-800 text-sm">
            ₱{order.total.toLocaleString()}
          </div>
          <div className="text-gray-400" style={{ fontSize: "0.65rem" }}>
            incl. delivery
          </div>
        </div>

        {/* 3-Dot Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            title="More actions"
          >
            <MoreVertical size={16} />
          </button>

          <OrderRowMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            order={order}
            onCancelOrder={() => {
              onCancelOrder();
              setIsMenuOpen(false);
            }}
            onUploadPayment={() => {
              onUploadPayment();
              setIsMenuOpen(false);
            }}
            onPayNow={() => {
              onPayNow();
              setIsMenuOpen(false);
            }}
            onViewDetails={() => {
              onExpand(isExpanded ? null : order.id);
              setIsMenuOpen(false);
            }}
            isExpanded={isExpanded}
            onShowCancelModal={() => setShowCancelModal(true)}
          />
        </div>
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        order={order}
        isLoading={isCancelling}
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelModal(false)}
      />
    </>
  );
}
