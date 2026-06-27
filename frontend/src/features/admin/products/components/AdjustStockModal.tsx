'use client';

import { X, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useUpdateProduct } from "@/features/admin/products/hooks/service-hooks/use-updateproduct";
import { toast } from "sonner";

interface AdjustStockModalProps {
  isOpen: boolean;
  product: {
    id: string;
    name: string;
    sku: string;
    category: string;
    categoryId: number;
    price: number;
    reorderPoint: number;
    available: number;
    inTransit: number;
    blocked: number;
  };
  onClose: () => void;
  onSubmit?: (data: { available: number; inTransit: number; blocked: number }) => void;
  isLoading?: boolean;
}

export function AdjustStockModal({
  isOpen,
  product,
  onClose,
  onSubmit,
}: AdjustStockModalProps) {
  // ✅ React Query mutation returns an object, not an array
  const updateProduct = useUpdateProduct();

  const [available, setAvailable] = useState(product.available.toString());
  const [inTransit, setInTransit] = useState(product.inTransit.toString());
  const [blocked, setBlocked]     = useState(product.blocked.toString());
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAvailable(product.available.toString());
    setInTransit(product.inTransit.toString());
    setBlocked(product.blocked.toString());
  }, [product.id, isOpen]);

  useEffect(() => {
    if (isOpen) setIsAnimating(true);
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleSubmit = () => {
    const data = {
      available: parseInt(available) || 0,
      inTransit: parseInt(inTransit) || 0,
      blocked:   parseInt(blocked)   || 0,
    };

    setLoading(true);
    const productId = parseInt(product.id);

    updateProduct
      .mutateAsync({
        id: productId,
        input: {
          productName: product.name,
          productDescription: "",
          sku: product.sku,
          categoryId: product.categoryId,
          productPrice: product.price,
          reorderPoint: product.reorderPoint,
          available: data.available,
          inTransit: data.inTransit,
          blocked:   data.blocked,
        },
      })
      .then(() => {
        onSubmit?.(data);
        toast.success("Stock levels updated successfully!");
        onClose();
      })
      .catch((err) => {
        toast.error("Failed to update stock levels.");
        console.error("❌ Mutation error:", err);
      })
      .finally(() => setLoading(false));
  };

  const totalStock =
    (parseInt(available) || 0) +
    (parseInt(inTransit) || 0) +
    (parseInt(blocked)   || 0);

  // shared input class — clean default, green focus
  const inputClass =
    "w-full px-3 py-2.5 rounded-lg border text-sm transition-all " +
    "border-gray-200 dark:border-sidebar-border " +
    "bg-gray-50 dark:bg-input-background " +
    "text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground/70 " +
    "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed top-0 left-0 w-screen h-screen z-40 bg-black/50"
        style={{
          animation: isOpen ? "fadeIn 0.2s ease-out" : "fadeOut 0.2s ease-out forwards",
        }}
        onClick={onClose}
        onAnimationEnd={() => { if (!isOpen) setIsAnimating(false); }}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="rounded-2xl overflow-hidden w-full max-w-sm pointer-events-auto
                     bg-white dark:bg-card
                     border border-gray-200 dark:border-sidebar-border
                     shadow-2xl"
          style={{
            animation: isOpen ? "slideUp 0.3s ease-out" : "slideDown 0.2s ease-out forwards",
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
          <div className="flex items-center justify-between px-6 py-4
                          border-b border-gray-200 dark:border-sidebar-border
                          bg-primary/5 dark:bg-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center
                              bg-white dark:bg-card
                              border border-gray-200 dark:border-sidebar-border shadow-sm">
                <Package size={18} className="text-primary" />
              </div>
              <h3 className="font-serif text-base font-semibold text-primary dark:text-gold-light">
                Adjust Stock Levels
              </h3>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="p-1.5 rounded-lg transition-colors
                         text-gray-500 hover:text-gray-800 hover:bg-gray-200
                         dark:text-muted-foreground dark:hover:text-gold dark:hover:bg-sidebar-accent
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-muted-foreground">
              Product:{" "}
              <span className="text-gray-900 dark:text-gold">{product.name}</span>
            </p>

            {/* Available */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gold">
                Available Quantity
              </label>
              <input
                type="number"
                value={available}
                onChange={(e) => setAvailable(e.target.value)}
                disabled={loading}
                className={inputClass}
              />
              <p className="text-[11px] mt-1 text-gray-400 dark:text-muted-foreground">
                Current: {product.available} units
              </p>
            </div>

            {/* In Transit */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gold">
                In Transit
              </label>
              <input
                type="number"
                value={inTransit}
                onChange={(e) => setInTransit(e.target.value)}
                disabled={loading}
                className={inputClass}
              />
              <p className="text-[11px] mt-1 text-gray-400 dark:text-muted-foreground">
                Current: {product.inTransit} units
              </p>
            </div>

            {/* Blocked */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gold">
                Blocked / Reserved
              </label>
              <input
                type="number"
                value={blocked}
                onChange={(e) => setBlocked(e.target.value)}
                disabled={loading}
                className={inputClass}
              />
              <p className="text-[11px] mt-1 text-gray-400 dark:text-muted-foreground">
                Current: {product.blocked} units
              </p>
            </div>

            {/* Total */}
            <div className="p-3 rounded-lg border-l-4 border-primary
                            bg-primary/5 dark:bg-primary/15">
              <p className="text-xs text-gray-600 dark:text-muted-foreground">
                Total Stock:{" "}
                <strong className="text-primary dark:text-gold-light text-sm">
                  {totalStock} units
                </strong>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-end gap-3
                          border-t border-gray-200 dark:border-sidebar-border">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors
                         border-gray-200 dark:border-sidebar-border
                         bg-gray-50 dark:bg-card
                         text-gray-700 dark:text-gold
                         hover:bg-gray-100 dark:hover:bg-sidebar-accent
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all
                         bg-primary text-[#F4F4F0]
                         hover:bg-primary/90 hover:shadow-md
                         focus:outline-none focus:ring-2 focus:ring-primary/30
                         active:scale-[0.98]
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Stock"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}