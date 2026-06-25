"use client";

import React from "react";
import Link from "next/link";
import { User, ShoppingCart } from "lucide-react";

interface HeaderActionsProps {
  cartItemCount?: number;
  isLoggedIn?: boolean;
}

export const HeaderActions = ({
  cartItemCount = 3,
  isLoggedIn = false,
}: HeaderActionsProps) => {
  return (
    <div className="flex items-center gap-7 flex-shrink-0">
      {/* My Account */}
      <Link
        href={isLoggedIn ? "/account" : "/login"}
        className="flex items-center gap-2 text-[#C9A96E] hover:text-white transition-colors text-sm font-medium"
      >
        <User className="w-[18px] h-[18px]" />
        <span className="hidden md:inline">My Account</span>
      </Link>

      {/* Cart */}
      <Link
        href="/cart"
        className="relative flex items-center gap-2 text-[#C9A96E] hover:text-white transition-colors text-sm font-medium pr-2"
      >
        <ShoppingCart className="w-[18px] h-[18px]" />
        <span className="hidden md:inline">Cart</span>
        {cartItemCount > 0 && (
          <span
            className="
              absolute -top-2 -right-1 bg-[#C9A96E] text-[#0C211C]
              text-[9px] font-bold w-[17px] h-[17px] rounded-full
              flex items-center justify-center leading-none
            "
          >
            {cartItemCount > 99 ? "99+" : cartItemCount}
          </span>
        )}
      </Link>
    </div>
  );
};