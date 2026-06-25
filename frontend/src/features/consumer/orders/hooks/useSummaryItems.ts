"use client";

import { useMemo } from "react";
import type { Order } from "../types/order";

interface SummaryItem {
  label: string;
  value: string;
  color: string;
  bg: string;
}

/**
 * Hook to calculate summary statistics from orders
 */
export function useSummaryItems(orders: Order[]): SummaryItem[] {
  return useMemo(() => {
    const processingOrders = orders.filter((o) => 
      ["PACKING", "READY_FOR_DELIVERY", "IN_TRANSIT", "AWAITING_PAYMENT_VERIFICATION"].includes(o.status)
    ).length;
    const totalPaid = orders
      .filter((o) => o.status === "DELIVERED")
      .reduce((sum, o) => sum + o.total, 0);
    const pendingPayment = orders
      .filter(
        (o) =>
          o.paymentStatus === "Pending" &&
          o.status !== "DELIVERED" &&
          o.status !== "CANCELLED"
      )
      .reduce((sum, o) => sum + o.total, 0);

    return [
      {
        label: "Total Orders",
        value: orders.length.toString(),
        color: "#6b7280",
        bg: "#f9fafb",
      },
      {
        label: "In Progress",
        value: processingOrders.toString(),
        color: "#f59e0b",
        bg: "#fffbeb",
      },
      {
        label: "Total Paid",
        value: `₱${totalPaid.toLocaleString("en-PH")}`,
        color: "#3b82f6",
        bg: "#eff6ff",
      },
      {
        label: "Pending Payment",
        value: `₱${pendingPayment.toLocaleString("en-PH")}`,
        color: "#ef4444",
        bg: "#fef2f2",
      },
    ];
  }, [orders]);
}
