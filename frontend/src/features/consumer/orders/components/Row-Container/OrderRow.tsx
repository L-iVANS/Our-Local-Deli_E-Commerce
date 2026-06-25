"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Order } from "../../types/order";
import { OrderDetails } from "../OrderDetails";
import { OrderRowInfo } from "./OrderRowInfo";
import { OrderRowActions } from "./OrderRowActions";
import { PaymentProofUploadModal } from "../../../../../components/modals/Payment-Proof";
import { PaymongoCheckoutModal } from "@/features/consumer/checkout";
import { useCancelOrder } from "../../hooks/use-cancel-order";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

interface OrderRowProps {
  order: Order;
  isExpanded: boolean;
  onExpand: (orderId: string | null) => void;
  index: number;
  isLastItem: boolean;
  onUploadSuccess?: () => void;
}

export function OrderRow({
  order,
  isExpanded,
  onExpand,
  index,
  isLastItem,
  onUploadSuccess,
}: OrderRowProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPaymongoModalOpen, setIsPaymongoModalOpen] = useState(false);
  const { cancelOrder: cancelOrderMutation } = useCancelOrder();

  const cancellableStatuses = ["PENDING_APPROVAL", "READY_FOR_BILLING", "AWAITING_PAYMENT_VERIFICATION"];
  const canCancel = cancellableStatuses.includes(order.status);
  const isPendingVerification =
    order.status === "AWAITING_PAYMENT_VERIFICATION" &&
    order.paymentProofStatus !== "rejected";

  const handleUploadPaymentProof = async (file: File): Promise<void> => {
    if (isPendingVerification) {
      toast.error("Payment proof is already under verification.");
      return;
    }

    try {
      const orderId =
        typeof order.id === "string" ? parseInt(order.id, 10) : order.id;

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${apiBaseUrl}/orders/upload-payment-proof/${orderId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload payment proof");
      }

      toast.success("Payment proof uploaded successfully!");
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to process payment proof";
      toast.error(errorMsg);
      throw error instanceof Error ? error : new Error(errorMsg);
    }
  };

  const handleCancelOrder = async () => {
    if (!canCancel) {
      toast.error("This order can no longer be cancelled.");
      return;
    }

    try {
      const orderId =
        typeof order.id === "string" ? parseInt(order.id, 10) : order.id;

      await cancelOrderMutation(orderId);

      toast.success("Order cancelled successfully!");
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error cancelling order";
      toast.error(errorMsg);
      console.error("Error cancelling order:", error);
    }
  };

  const isCancelled = order.status === "CANCELLED";

  return (
    <>
      <div className={`mb-3 rounded-lg border ${isCancelled ? "border-gray-300 bg-gray-50" : "border-slate-200"}`}>
        <div className="px-5 py-8 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50/50 transition-colors min-h-full relative">
          <OrderRowInfo order={order} />

          <OrderRowActions
            order={order}
            isExpanded={isExpanded}
            onExpand={onExpand}
            onCancelOrder={handleCancelOrder}
            onUploadPayment={() => {
              if (isPendingVerification) {
                toast.error("Payment proof is already under verification.");
                return;
              }
              setIsUploadModalOpen(true);
            }}
            onPayNow={() => setIsPaymongoModalOpen(true)}
          />
        </div>

        {isExpanded && (
          <OrderDetails
            order={order}
            onReUploadClick={() => setIsUploadModalOpen(true)}
          />
        )}
      </div>

      <PaymentProofUploadModal
        isOpen={isUploadModalOpen}
        orderId={order.id}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadPaymentProof}
      />

      <PaymongoCheckoutModal
        isOpen={isPaymongoModalOpen}
        orderId={typeof order.id === "string" ? parseInt(order.id, 10) : order.id}
        orderAmount={order.total}
        orderNumber={order.sapSo}
        onClose={() => setIsPaymongoModalOpen(false)}
        onSuccess={onUploadSuccess}
      />
    </>
  );
}
