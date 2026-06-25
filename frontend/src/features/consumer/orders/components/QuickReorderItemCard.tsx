"use client";

import { ShoppingCart } from "lucide-react";
import type { Product } from "@/data/products";

interface QuickReorderItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  lastQty: number;
  stock: number;
}

interface QuickReorderItemProps {
  item: QuickReorderItem;
  qty: string;
  onQtyChange: (qty: string) => void;
  onAddToCart: () => void;
}

export function QuickReorderItemCard({ item, qty, onQtyChange, onAddToCart }: QuickReorderItemProps) {
  const quantity = parseInt(qty) || 0;
  const isDisabled = !qty || quantity <= 0;
  const total = item.price * quantity;

  return (
    <div
      className="p-3 rounded-xl border transition-all hover:border-red-200 hover:bg-red-50/30"
      style={{ borderColor: "#f1f5f9" }}
    >
      {/* Item Info */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">
            {item.name}
          </div>
          <div className="font-mono text-gray-400 mt-0.5" style={{ fontSize: "0.65rem" }}>
            {item.sku}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs font-bold text-gray-800">₱{item.price.toLocaleString()}</div>
          <div className="text-gray-400" style={{ fontSize: "0.65rem" }}>
            WS price
          </div>
        </div>
      </div>

      {/* Input & Button */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder={`Last: ${item.lastQty}`}
          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none transition-all"
          style={{ borderColor: "#e2e8f0", fontSize: "0.75rem" }}
          value={qty}
          onChange={(e) => onQtyChange(e.target.value)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#bf262f";
            e.currentTarget.style.boxShadow = "0 0 0 2px rgba(191,38,47,0.08)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <button
          onClick={onAddToCart}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all hover:opacity-90 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#bf262f" }}
          disabled={isDisabled}
        >
          <ShoppingCart size={11} />
          Add
        </button>
      </div>

      {/* Stock & Total */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-gray-400" style={{ fontSize: "0.65rem" }}>
          Stock: {item.stock.toLocaleString()} units
        </span>
        {quantity > 0 && (
          <span className="text-green-600 font-semibold" style={{ fontSize: "0.65rem" }}>
            Total: ₱{total.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}
