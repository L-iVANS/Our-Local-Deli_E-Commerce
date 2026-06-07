"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem, Company } from "../types";

// Helper function to convert product name to URL slug
const productNameToSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "");
};

interface CartItemsProps {
  items: CartItem[];
  company: Company;
  moqWarnings: CartItem[];
  selectedItemIds: string[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onToggleItemSelection: (productId: string) => void;
}

export function CartItems({
  items,
  company,
  moqWarnings,
  selectedItemIds,
  onUpdateQty,
  onRemoveItem,
  onToggleItemSelection,
}: CartItemsProps) {
  return (
    <div className="lg:col-span-2 space-y-3">
      {/* Items list */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Column headers */}
        <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 border-b border-gray-50">
          <div className="col-span-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</div>
          <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Price</div>
          <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Qty</div>
          <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Total</div>
        </div>

        {items.map((item) => {
          const isSelected = selectedItemIds.includes(item.product.id);

          return (
            <div
              key={item.product.id}
              className="border-b border-gray-50 last:border-0"
            >
              <div className="grid grid-cols-12 gap-3 px-4 sm:px-5 py-4 items-center">
                {/* Product info */}
                <div className="col-span-12 sm:col-span-6 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleItemSelection(item.product.id)}
                    aria-label={`Select ${item.product.name} for checkout`}
                    className="h-3 w-3 shrink-0 accent-red-600 cursor-pointer"
                  />
                  {(item.product.imageUrl || item.product.image) && (
                    <img
                      src={item.product.imageUrl || item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="text-gray-400 text-xs mb-0.5">{item.product.category}</div>
                    <Link
                      href={`/b2b/products/${productNameToSlug(item.product.name)}`}
                      className="text-gray-800 text-xs font-medium leading-snug hover:text-red-600 transition-colors line-clamp-2 block"
                    >
                      {item.product.name}
                    </Link>
                    {item.selectedColor && (
                      <div className="text-gray-400 text-xs mt-0.5">Color: {item.selectedColor}</div>
                    )}
                    {item.selectedSize && (
                      <div className="text-gray-400 text-xs mt-0.5">Size: {item.selectedSize}</div>
                    )}
                  </div>
                </div>

                {/* Unit price */}
                <div className="col-span-4 sm:col-span-2 text-left sm:text-center">
                  <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5 sm:hidden">Price</div>
                  <div className="text-gray-900 text-sm font-medium">₱{item.unitPrice.toLocaleString()}</div>
                  {item.unitPrice < (item.product.retailPrice ?? 0) && (
                    <div className="text-gray-300 text-xs line-through">₱{(item.product.retailPrice ?? 0).toLocaleString()}</div>
                  )}
                </div>

                {/* Qty stepper */}
                <div className="col-span-4 sm:col-span-2 flex items-center justify-start sm:justify-center">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1 sm:hidden">Qty</div>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateQty(item.product.id, item.qty - 1);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-gray-800 border-x border-gray-200">
                      {item.qty}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateQty(item.product.id, item.qty + 1);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  </div>
                </div>

                {/* Line total + remove */}
                <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-2">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5 sm:hidden">Total</div>
                    <span className="text-gray-900 font-bold text-sm whitespace-nowrap">
                      ₱{(item.qty * item.unitPrice).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors ml-1 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
