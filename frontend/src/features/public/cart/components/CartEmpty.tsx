"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";

export function CartEmpty() {
  return (
    <div
      className="bg-[#F2ECDF] min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-12"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 background-primary"
        >
          <ShoppingCart size={28} />
        </div>

        {/* Heading */}
        <h2
          className="text-gray-900 mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          Your order is empty
        </h2>

        {/* Subtext */}
        <p className="text-gray-400 text-sm mb-7 max-w-xs">
          Browse the catalog and add products to start building your order.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:w-auto">
          <Link
            href="/#hero"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-300 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/catalog"
            className="px-5 py-2.5 rounded-xl text-primary text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 border border-primary"
          >
            Browse Catalog <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}