"use client";

import { useMemo } from "react";
import type { Order } from "../types/order";

interface QuickReorderItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  lastQty: number;
  stock: number;
}

/**
 * Hook to extract and aggregate most-ordered items from order history
 */
export function useMostOrderedItems(orders: Order[], limit: number = 5): QuickReorderItem[] {
  return useMemo(() => {
    const productMap = new Map<string, { name: string; qty: number; lastQty: number; occurrences: number }>();

    orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const productId = item.sku || item.id || "unknown";
          const productName = item.name || item.productName || "Unknown Product";
          const itemQty = item.qty || item.quantity || 1;

          if (productMap.has(productId)) {
            const existing = productMap.get(productId)!;
            existing.qty += itemQty;
            existing.occurrences += 1;
            existing.lastQty = itemQty;
          } else {
            productMap.set(productId, {
              name: productName,
              qty: itemQty,
              lastQty: itemQty,
              occurrences: 1,
            });
          }
        });
      }
    });

    // Sort by occurrences and return top N items
    return Array.from(productMap.entries())
      .sort((a, b) => (b[1].occurrences || 0) - (a[1].occurrences || 0))
      .slice(0, limit)
      .map(([id, data]) => ({
        id,
        name: data.name,
        sku: id,
        price: 500, // Default price - could be fetched from backend
        lastQty: data.lastQty,
        stock: 1000, // Default stock - could be fetched from backend
      }));
  }, [orders, limit]);
}
