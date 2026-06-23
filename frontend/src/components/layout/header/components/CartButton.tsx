"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartButtonProps {
  textColor: string;
  itemCount: number;
}

/**
 * Shopping cart link with a badge showing the current item count.
 */
export function CartButton({ textColor, itemCount }: CartButtonProps) {
  return (
    <div className="relative">
      <Link
        href="/cart"
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors hover:border-gray-300",
          textColor,
        )}
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        <ShoppingCart size={15} />
      </Link>

      {itemCount > 0 && (
        <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </div>
  );
}
