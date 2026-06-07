"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PaymentProofUploadModal } from "@/components/modals/Payment-Proof";
import { OrderSuccessHeader } from "./OrderSuccessHeader";
import { OrderReferenceBox } from "./OrderReferenceBox";
import { TotalAmountBox } from "./TotalAmountBox";
import { BankTransferDetails } from "./BankTransferDetails";
import { OrderNextSteps } from "./OrderNextSteps";
import { OrderSuccessActions } from "./OrderSuccessActions";
import { SupportFooter } from "./SupportFooter";

const RED = "#bf262f";
const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

interface OrderSuccessProps {
  orderNumber: string;
  orderId?: string;
  grandTotal?: number;
}

export function OrderSuccess({ orderNumber, orderId = "", grandTotal = 0 }: OrderSuccessProps) {
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [resolvedOrderId] = useState<number | null>(
    orderId ? parseInt(orderId, 10) : null
  );

  const bankAccount = {
    bank: "BDO Unibank",
    accountName: "Omega Houseware",
    accountNumber: "1234567890",
    reference: orderNumber,
  };

  const handleUploadPaymentProof = async (file: File): Promise<void> => {
    try {
      if (!resolvedOrderId) {
        throw new Error("Order ID is missing. Please navigate to order success page via the checkout flow. If you arrived here directly, please contact support.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${apiBaseUrl}/orders/upload-payment-proof/${resolvedOrderId}`,
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
      toast.success("Order status updated to processing!");
      setIsUploadModalOpen(false);
      
      setTimeout(() => {
        router.push("/b2b/my-orders");
      }, 1500);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to upload payment proof";
      toast.error(errorMsg);
      throw error;
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Top band */}
          <div
            className="h-2 w-full"
            style={{ background: `linear-gradient(90deg, ${RED}, #8f1d23)` }}
          />

          <div className="px-8 py-8 text-center">
            <OrderSuccessHeader />
            <OrderReferenceBox orderNumber={orderNumber} />
            <TotalAmountBox grandTotal={grandTotal} />
            <BankTransferDetails
              bankAccount={bankAccount}
              resolvedOrderId={resolvedOrderId}
              onUploadClick={() => setIsUploadModalOpen(true)}
            />
            <OrderNextSteps />
            <OrderSuccessActions />
          </div>
        </div>

        <SupportFooter />
      </div>

      {/* Payment Proof Upload Modal */}
      <PaymentProofUploadModal
        isOpen={isUploadModalOpen}
        orderId={orderNumber}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadPaymentProof}
      />
    </div>
  );
}
