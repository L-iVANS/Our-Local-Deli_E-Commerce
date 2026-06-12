"use client";

import { X, ShoppingCart } from "lucide-react";
import type { Product as B2BProduct } from "@/features/b2b/cart/hooks/useCart";
import type { Product as GeneralProduct } from "@/data/products";

type Product = B2BProduct | GeneralProduct;

interface AddToCartConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => void;
  onContinueShopping: () => void;
}

export function AddToCartConfirmModal({
  isOpen,
  product,
  onClose,
  onConfirm,
  onContinueShopping,
}: AddToCartConfirmModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors z-10"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Success icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#cd3842" }}
            >
              <ShoppingCart size={28} style={{ color: "#ffffff" }} />
            </div>
          </div>

          {/* Product info */}
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Product Added!
          </h2>
          <p className="text-gray-700 font-semibold mb-1">{product.name}</p>
          <p className="text-gray-500 text-sm mb-6">
            has been added to your cart.
          </p>

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            {/* Proceed to checkout */}
            <button
              onClick={onConfirm}
              className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#3b82f6" }}
            >
              <ShoppingCart size={16} />
              Proceed to Checkout
            </button>

            {/* Continue shopping */}
            <button
              onClick={onContinueShopping}
              className="w-full py-3 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
