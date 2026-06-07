"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CartItem, Company } from "../types";
import { CART_COLORS, CART_CONFIG, getDiscountLabel, getDiscountRate } from "../constants/cartConstants";

interface CartSummaryProps {
  items: CartItem[];
  company: Company;
  subtotal: number; 
  itemCount: number;
  hasSelectedItems: boolean;
  onProceed: () => void;
}

export function CartSummary({
  items,
  company,
  subtotal,
  itemCount,
  hasSelectedItems,
  onProceed,
}: CartSummaryProps) {
  const { RED, RED_LIGHT } = CART_COLORS;
  const { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } = CART_CONFIG;

  const fullRetailTotal = items.reduce((s, i) => s + i.qty * (i.product.retailPrice ?? 0), 0);
  const discountRate = getDiscountRate(itemCount);
  const discountAmount = Math.round(subtotal * discountRate);
  const discountLabel = getDiscountLabel(itemCount);
  // Show 0 delivery fee if no items are selected, otherwise calculate based on subtotal
  const deliveryFee = itemCount === 0 ? 0 : (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);
  const discountedSubtotal = subtotal - discountAmount;
  const grandTotal = discountedSubtotal + deliveryFee;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3
          className="text-gray-900 font-semibold mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Order Summary
        </h3>

        {/* Line items */}
        <div className="space-y-2.5 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Selected subtotal ({itemCount} items)</span>
            <span className="text-gray-900 font-medium">₱{subtotal.toLocaleString()}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount ({discountLabel})</span>
              <span className="text-green-600 font-medium">-₱{discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery fee</span>
            <span className="text-gray-900 font-medium">
              {deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₱${deliveryFee}`}
            </span>
          </div>
          {deliveryFee > 0 && (
            <p className="text-gray-400 text-xs">
              Add ₱{(FREE_DELIVERY_THRESHOLD - subtotal).toLocaleString()} more for free delivery.
            </p>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-semibold">Grand Total</span>
            <span
              className="font-extrabold text-xl"
              style={{ fontFamily: "'Playfair Display', serif",}}
            >
              ₱{grandTotal.toLocaleString()}
            </span>
          </div>
          <div className="text-gray-400 text-xs mt-0.5">VAT inclusive</div>
        </div>

        <button
          onClick={onProceed}
          disabled={!hasSelectedItems}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 bg-blue-600"
          
        >
          {hasSelectedItems ? "Proceed to Checkout" : "Select Items to Order"} <ArrowRight size={15} />
        </button>
        {!hasSelectedItems && (
          <p className="mt-2 text-xs text-gray-400">
            Choose at least one cart item to continue to checkout.
          </p>
        )}
        <Link
          href="/products"
          className="w-full mt-2.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-gray-600 border border-gray-200 hover:border-gray-300 transition-colors"
        >
          Continue Adding Products
        </Link>
      </div>

      {/* Quick account info */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Billing Account
        </div>
        <div className="space-y-1.5 text-xs text-gray-500">
          <div>
            <strong className="text-gray-700">{company.name}</strong>
          </div>
          <div>{company.accountNumber}</div>
          <div>{company.email}</div>
        </div>
      </div>
    </div>
  );
}
