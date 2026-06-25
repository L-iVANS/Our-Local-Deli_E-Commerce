"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Order } from "../types/order";
import { OrderDetails } from "./OrderDetails";
import { OrderRowInfo } from "./Row-Container/OrderRowInfo";
import { OrderRowActions } from "./Row-Container/OrderRowActions";
import { PaymentProofUploadModal } from "../../../../components/modals/Payment-Proof";
import { PaymongoCheckoutModal } from "@/features/b2b/checkout";
import { useCancelOrder } from "../hooks/use-cancel-order";
import { Upload, Eye, ChevronUp, ChevronDown, RotateCcw, CreditCard } from 'lucide-react';

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
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPaymongoModalOpen, setIsPaymongoModalOpen] = useState(false);
  const { cancelOrder: cancelOrderMutation } = useCancelOrder();

  const cancellableStatuses = ["PENDING_APPROVAL", "READY_FOR_BILLING", "AWAITING_PAYMENT_VERIFICATION"];
  const canCancel = cancellableStatuses.includes(order.status);

  const handlePaymongoCancel = () => {
    setIsPaymongoModalOpen(false);
    // Redirect to Processing section of orders
    router.push("/b2b/my-orders?tab=Processing");
  };

  const handleUploadPaymentProof = async (file: File): Promise<void> => {
    try {
      const orderId =
        typeof order.id === "string" ? parseInt(order.id, 10) : order.id;

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_IMAGE_PATH}${orderId}`,
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
      
      // Give the backend a moment to process the file, then refetch
      // This ensures the new image and status updates are reflected
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
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

  return (
    <>
      <div className="mb-3 rounded-lg border border-slate-200">
        <div className="px-5 py-8 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50/50 transition-colors min-h-full relative">
          <OrderRowInfo order={order} />

          <OrderRowActions
            order={order}
            isExpanded={isExpanded}
            onExpand={onExpand}
            onCancelOrder={handleCancelOrder}
            onUploadPayment={() => setIsUploadModalOpen(true)}
            onPayNow={() => setIsPaymongoModalOpen(true)}
          />
        </div>

        {isExpanded && <OrderDetails order={order} onReUploadClick={() => setIsUploadModalOpen(true)} />}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="font-bold text-gray-800 text-sm">
              ₱{order.total.toLocaleString()}
            </div>
            <div className="text-gray-400" style={{ fontSize: "0.65rem" }}>
              incl. delivery
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {order.status === "DELIVERED" && (
              <button
                className="p-2 rounded-lg border transition-colors hover:bg-gray-50 text-gray-500"
                style={{ borderColor: "#e2e8f0" }}
                title="Reorder"
              >
                <RotateCcw size={13} />
              </button>
            )}
            {(order.status === "PENDING_APPROVAL" || order.status === "READY_FOR_BILLING" || order.status === "AWAITING_PAYMENT_VERIFICATION") && (
              <>
                <button
                  onClick={() => setIsPaymongoModalOpen(true)}
                  className="p-2 rounded-lg border transition-colors hover:bg-green-50 hover:text-green-600 hover:border-green-500 text-gray-500 border-gray-500"
                  title="Pay Now with PayMongo"
                >
                  <CreditCard size={13} />
                </button>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="p-2 rounded-lg border transition-colors hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500 text-gray-500 border-gray-500"
                  title="Upload Payment Proof"
                >
                  <Upload size={13} />
                </button>
              </>
            )}
            <button
              onClick={() => onExpand(isExpanded ? null : order.id)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border text-xs font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: "#e2e8f0", color: "#4b5563" }}
            >
              <Eye size={12} />
              {isExpanded ? "Close" : "Details"}
              {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          </div>
        </div>
      </div>

      <PaymentProofUploadModal
        isOpen={isUploadModalOpen}
        orderId={order.id}
        attemptsRemaining={3 - (order.paymentProofAttempts || 0)}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadPaymentProof}
      />

      <PaymongoCheckoutModal
        isOpen={isPaymongoModalOpen}
        orderId={typeof order.id === "string" ? parseInt(order.id, 10) : order.id}
        orderAmount={order.total}
        orderNumber={order.sapSo}
        onClose={handlePaymongoCancel}
        onSuccess={onUploadSuccess}
      />
    </>
  );
}
