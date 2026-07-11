// src/app/consumer/order-failed/page.tsx
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckoutFailedContent } from "@/features/consumer/checkout/components/CheckoutFailedContent";

function OrderFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId") ?? null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <CheckoutFailedContent
        orderId={orderId}
        onBackHome={() => router.push("/")}
        onRetryPayment={() => router.push(`/consumer/checkout?retry=${orderId}`)}
      />
    </div>
  );
}

export default function OrderFailedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderFailedContent />
    </Suspense>
  );
}