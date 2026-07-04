// src/app/(consumer)/consumer/order-success/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OrderSuccess } from "@/features/public/cart/components/OrderSuccess";

function OrderSuccessContent() {
  const searchParams = useSearchParams();

  // ✅ No Math.random — use the real value from the URL, fall back to empty string
  const orderNumber = searchParams?.get("orderNumber") ?? "";
  const orderId = searchParams?.get("orderId") ?? "";
  const grandTotal = searchParams?.get("grandTotal") ?? "0";

  return (
    <OrderSuccess
      orderNumber={orderNumber}
      orderId={orderId}
      grandTotal={parseFloat(grandTotal)}
    />
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}