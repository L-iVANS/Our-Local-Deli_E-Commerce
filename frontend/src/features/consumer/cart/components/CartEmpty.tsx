"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { CART_COLORS } from "../constants/cartConstants";

export function CartEmpty() {
  const { RED, RED_LIGHT } = CART_COLORS;

  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: RED_LIGHT }}
      >
        <ShoppingCart size={28} style={{ color: RED }} />
      </div>
      <h2
        className="text-gray-900 mb-2"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700 }}
      >
        Your order is empty
      </h2>
      <p className="text-gray-400 text-sm mb-7 max-w-xs">
        Browse the catalog and add products to start building your order.
      </p>
      <div className="flex gap-3">
          <Link href="/b2b/home" className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-300 transition-colors">
          Back to Home
        </Link>
          <Link
            href="/b2b/products"
          className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          style={{ backgroundColor: RED }}
        >
          Browse Catalog <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
