'use client';

import { X, Package } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductDetailsModalProps {
  isOpen: boolean;
  product: {
    id: string;
    name: string;
    sku: string;
    category: string;
    categoryId: number;
    available: number;
    inTransit: number;
    blocked: number;
    reorderPoint: number;
    price: number;
    status: string;
  };
  onClose: () => void;
}

export function ProductDetailsModal({
  isOpen,
  product,
  onClose,
}: ProductDetailsModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) setIsAnimating(true);
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const totalStock = product.available + product.inTransit + product.blocked;
  const stockPercentage =
    product.reorderPoint > 0
      ? (product.available / product.reorderPoint) * 100
      : 0;

  // status color helper (keeps semantic meaning while fitting the theme)
  const statusStyle = (() => {
    const s = product.status.toLowerCase();
    if (s.includes("out") || s.includes("inactive")) {
      return "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-700/40";
    }
    if (s.includes("low")) {
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-700/40";
    }
    // active / default → green theme
    return "bg-primary/10 text-primary border-primary/30 dark:bg-primary/25 dark:text-gold-light dark:border-gold/40";
  })();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed top-0 left-0 w-screen h-screen z-40 bg-black/50"
        style={{
          animation: isOpen
            ? "fadeIn 0.2s ease-out"
            : "fadeOut 0.2s ease-out forwards",
        }}
        onClick={onClose}
        onAnimationEnd={() => { if (!isOpen) setIsAnimating(false); }}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="rounded-2xl overflow-hidden w-full max-w-2xl pointer-events-auto
                     bg-white dark:bg-card
                     border border-gray-200 dark:border-sidebar-border
                     shadow-2xl"
          style={{
            animation: isOpen
              ? "slideUp 0.3s ease-out"
              : "slideDown 0.2s ease-out forwards",
          }}
          onAnimationEnd={() => { if (!isOpen) setIsAnimating(false); }}
        >
          <style>{`
            @keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 } }
            @keyframes fadeOut  { from { opacity: 1 } to { opacity: 0 } }
            @keyframes slideUp  { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
            @keyframes slideDown{ from { opacity: 1; transform: translateY(0)   } to { opacity: 0; transform: translateY(20px) } }
          `}</style>

          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between
                          border-b border-gray-200 dark:border-sidebar-border
                          bg-primary/5 dark:bg-primary/20">
            <h3 className="font-serif text-lg font-semibold text-primary dark:text-gold-light">
              Product Details
            </h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-lg transition-colors
                         text-gray-500 hover:text-gray-800 hover:bg-gray-200
                         dark:text-muted-foreground dark:hover:text-gold dark:hover:bg-sidebar-accent"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Product Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0
                              bg-primary/10 dark:bg-primary/25
                              border border-primary/20 dark:border-gold/30">
                <Package size={28} className="text-primary dark:text-gold-light" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-xl font-semibold truncate
                               text-gray-900 dark:text-gold-light">
                  {product.name}
                </h2>
                <p className="text-sm mt-1 text-gray-500 dark:text-muted-foreground">
                  SKU:{" "}
                  <span className="font-mono font-semibold text-gray-700 dark:text-gold">
                    {product.sku}
                  </span>
                </p>
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-4 pb-4
                            border-b border-gray-200 dark:border-sidebar-border">
              <div>
                <p className="text-xs font-semibold mb-1.5 text-gray-400 dark:text-muted-foreground">
                  Category
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gold">
                  {product.category}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1.5 text-gray-400 dark:text-muted-foreground">
                  Price
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gold">
                  ₱{product.price.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1.5 text-gray-400 dark:text-muted-foreground">
                  Status
                </p>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle}`}>
                  {product.status}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1.5 text-gray-400 dark:text-muted-foreground">
                  Reorder Point
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gold">
                  {product.reorderPoint} units
                </p>
              </div>
            </div>

            {/* Stock Levels */}
            <div>
              <h3 className="font-serif text-base font-semibold mb-3 text-primary dark:text-gold-light">
                Stock Levels
              </h3>

              <div className="space-y-3">
                {/* Available */}
                {/* Available — deep emerald (matches your primary green) */}
                <StockBar
                  label="Available"
                  value={product.available}
                  percent={Math.min(stockPercentage, 100)}
                  barClass="bg-[#0A3A2B] dark:bg-[#1F6B52]"
                  valueClass="text-[#0A3A2B] dark:text-[#5EBF99]"
                />

                {/* In Transit — warm gold (uses your theme accent) */}
                <StockBar
                  label="In Transit"
                  value={product.inTransit}
                  percent={totalStock ? (product.inTransit / totalStock) * 100 : 0}
                  barClass="bg-[#A8844C] dark:bg-[#C9A96E]"
                  valueClass="text-[#A8844C] dark:text-[#D9B56A]"
                />

                {/* Blocked — muted burgundy (keeps urgency, feels premium) */}
                <StockBar
                  label="Blocked"
                  value={product.blocked}
                  percent={totalStock ? (product.blocked / totalStock) * 100 : 0}
                  barClass="bg-[#A14545] dark:bg-[#C97070]"
                  valueClass="text-[#A14545] dark:text-[#E89999]"
                />
              </div>

              {/* Total Stock */}
              <div className="mt-4 p-3 rounded-lg border-l-4 border-primary
                              bg-primary/5 dark:bg-primary/15">
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                  Total Stock:{" "}
                  <strong className="text-primary dark:text-gold-light text-[15px]">
                    {totalStock} units
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-sidebar-border">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all
                         bg-primary text-[#F4F4F0] shadow-sm
                         hover:bg-primary/90 hover:shadow-md
                         focus:outline-none focus:ring-2 focus:ring-primary/30
                         active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   Small reusable stock bar component
   ───────────────────────────────────────── */
function StockBar({
  label,
  value,
  percent,
  barClass,
  valueClass,
}: {
  label: string;
  value: number;
  percent: number;
  barClass: string;
  valueClass: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-gray-700 dark:text-gold">
          {label}
        </span>
        <span className={`text-sm font-bold ${valueClass}`}>
          {value} units
        </span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden
                      bg-gray-100 dark:bg-sidebar-accent">
        <div
          className={`h-2 rounded-full transition-all ${barClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}