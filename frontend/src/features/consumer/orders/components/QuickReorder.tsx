"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCart } from "@/features/b2b/cart/hooks/useCart";
import type { Product } from "@/features/b2b/cart/hooks/useCart";
import { QuickReorderHeader } from "./QuickReorderHeader";
import { QuickReorderItemCard } from "./QuickReorderItemCard";

interface QuickReorderItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  lastQty: number;
  stock: number;
}

interface QuickReorderProps {
  items: QuickReorderItem[];
}

export function QuickReorder({ items }: QuickReorderProps) {
  const [reorderQtys, setReorderQtys] = useState<Record<string, string>>({});
  const { addItem } = useCart();

  const handleAddToCart = (item: QuickReorderItem, qty: string) => {
    const quantity = parseInt(qty) || 0;
    if (quantity > 0) {
      const product: Product = {
        id: item.id,
        name: item.name,
        price: item.price,
        retailPrice: item.price,
        image: "",
        category: "Quick Reorder",
        rating: 0,
      };
      addItem(product, quantity);
      setReorderQtys({ ...reorderQtys, [item.id]: "" });
    }
  };

  return (
    <div
      className="bg-white rounded-xl border"
      style={{ borderColor: "#e2e8f0" }}
    >
      {/* Header */}
      <QuickReorderHeader />

      {/* Items List */}
      <div className="p-4 space-y-3">
        {items.map((item) => (
          <QuickReorderItemCard
            key={item.id}
            item={item}
            qty={reorderQtys[item.id] || ""}
            onQtyChange={(qty) => setReorderQtys({ ...reorderQtys, [item.id]: qty })}
            onAddToCart={() => handleAddToCart(item, reorderQtys[item.id] || "0")}
          />
        ))}
      </div>

      {/* Browse Catalog Link */}
      <div className="px-4 pb-4">
        <Link
          href="/b2b/products/all"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border text-xs font-semibold transition-all hover:bg-gray-50"
          style={{ borderColor: "#e2e8f0", color: "#4b5563" }}
        >
          Browse Full Catalog <ArrowRight size={13} />
        </Link>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="px-4 py-8 text-center">
          <p className="text-gray-500 text-sm">No recent items to reorder</p>
        </div>
      )}
    </div>
  );
}
