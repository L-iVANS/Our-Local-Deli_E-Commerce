"use client";

import { useMemo } from "react";
import { useCart } from "@/features/b2b/cart/hooks/useCart";
import { useAuth } from "@/features/auth";
import type { Order } from "../types/order";

/**
 * Hook to convert current cart items into an order draft
 * Useful for preview before placing order
 */
export function useOrdersFromCart() {
  const { items } = useCart();
  const { company } = useAuth();

  const orderDraft = useMemo(() => {
    if (items.length === 0) return null;

    const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    const vat = Math.round(subtotal * 0.12); // 12% VAT (adjust as needed)
    const total = subtotal + vat;

    return {
      id: "", // Will be assigned when order is placed
      sapSo: "", // Will be assigned when order is placed
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      customer: company?.companyName || company?.fullName || "Unknown",
      items: items.map((item) => ({
        sku: item.product.id,
        name: item.product.name,
        qty: item.qty,
        unitPrice: item.unitPrice,
        total: item.qty * item.unitPrice,
      })),
      subtotal,
      vat,
      total,
      status: "PENDING_APPROVAL" as const,
      paymentStatus: "Pending" as const,
      deliveryMethod: "—",
      notes: "Order created from cart",
    } as Order;
  }, [items, company]);

  return orderDraft;
}
