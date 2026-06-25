"use client";

import { useState, useMemo } from "react";
import type { Order, OrderStatus, OrderTabStatus } from "../types/order";

export function useOrders(orders: Order[]) {
  const [activeTab, setActiveTab] = useState<OrderTabStatus>("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      // For "All" tab, exclude REJECTED and CANCELLED orders
      if (activeTab === "All") {
        if (o.status === "REJECTED" || o.status === "CANCELLED") {
          return false;
        }
        // Continue with search filtering
      } else {
        // Map activeTab display name to backend status values
        const tabStatusMap: Record<OrderTabStatus, string[]> = {
          "All": [],
          "Open": ["PENDING_APPROVAL", "READY_FOR_BILLING"],
          "Processing": ["ACCEPT", "ORDERED_FROM_SUPPLIER", "AWAITING_PAYMENT_VERIFICATION", "PACKING", "READY_FOR_DELIVERY"],
          "Shipped": ["IN_TRANSIT", "PAID"],
          "Delivered": ["DELIVERED"],
          "Cancelled": ["CANCELLED"],
          "Rejected": ["REJECTED"],
        };
        
        const allowedStatuses = tabStatusMap[activeTab] || [];
        if (!allowedStatuses.includes(o.status)) {
          return false;
        }
      }
      
      if (
        search &&
        !o.id.toLowerCase().includes(search.toLowerCase()) &&
        !o.sapSo.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [orders, activeTab, search]);

  const counts = useMemo(() => {
    return {
      All: orders.filter((o) => o.status !== "CANCELLED" && o.status !== "REJECTED").length,
      Open: orders.filter((o) => o.status === "PENDING_APPROVAL" || o.status === "READY_FOR_BILLING").length,
      Processing: orders.filter((o) => o.status === "ACCEPT" || o.status === "ORDERED_FROM_SUPPLIER" || o.status === "AWAITING_PAYMENT_VERIFICATION" || o.status === "PACKING" || o.status === "READY_FOR_DELIVERY").length,
      Shipped: orders.filter((o) => o.status === "IN_TRANSIT" || o.status === "PAID").length,
      Delivered: orders.filter((o) => o.status === "DELIVERED").length,
      Cancelled: orders.filter((o) => o.status === "CANCELLED").length,
      Rejected: orders.filter((o) => o.status === "REJECTED").length,
    } as Record<OrderTabStatus, number>;
  }, [orders]);

  return {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    expanded,
    setExpanded,
    filtered,
    counts,
  };
}
