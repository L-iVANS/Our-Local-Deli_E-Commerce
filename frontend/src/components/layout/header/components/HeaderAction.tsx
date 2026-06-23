"use client";

import React from "react";
import { SearchButton } from "./SearchButton";
import { CartButton } from "./CartButton";
import { UserBadge } from "./UserBadge";
import { MobileMenuToggle } from "./MobileMenuToggle";

interface HeaderActionsProps {
  textColor: string;
  cartItemCount: number;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  isLoggedIn: boolean;
  displayName: string;
  displayInitial: string;
}

/**
 * Right-side action bar: search, cart, mobile toggle, and user badge.
 */
export function HeaderActions({
  textColor,
  cartItemCount,
  isMobileMenuOpen,
  onMobileMenuToggle,
  isLoggedIn,
  displayName,
  displayInitial,
}: HeaderActionsProps) {
  return (
    <div className="w-48 shrink-0 flex justify-end items-center gap-5">
      <SearchButton textColor={textColor} />
      <CartButton textColor={textColor} itemCount={cartItemCount} />
      <MobileMenuToggle
        isOpen={isMobileMenuOpen}
        textColor={textColor}
        onToggle={onMobileMenuToggle}
      />

      {isLoggedIn && (
        <UserBadge
          displayName={displayName}
          displayInitial={displayInitial}
        />
      )}
    </div>
  );
}
