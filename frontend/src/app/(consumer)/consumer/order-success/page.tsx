"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OrderSuccess } from "@/features/public/cart/components/OrderSuccess";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber =
    searchParams?.get("orderNumber") ||
    `OMG-2025-${String(Math.floor(Math.random() * 900 + 100)).padStart(6, "0")}`;
  const orderId = searchParams?.get("orderId") || "";
  const grandTotal = searchParams?.get("grandTotal") || "0";

  return <OrderSuccess orderNumber={orderNumber} orderId={orderId} grandTotal={parseFloat(grandTotal)} />;
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
