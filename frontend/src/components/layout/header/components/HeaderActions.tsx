"use client";

import React, { useState, useCallback } from "react";
import { SearchButton } from "./SearchButton";
import { CartButton } from "./CartButton";
import { ProfileDropdown } from "./ProfileDropdown";
import { MobileMenuToggle } from "./MobileMenuToggle";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface HeaderActionsProps {
  textColor: string;
  cartItemCount: number;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  isLoggedIn: boolean;
  displayName: string;
  displayInitial: string;
  onLogout: () => void;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

/**
 * Right-side action bar: search, cart, profile dropdown, mobile toggle.
 *
 * Changes from the previous version:
 * - `UserBadge` replaced by `ProfileDropdown` — it fetches enriched
 *   profile data and owns its own open/close state internally.
 * - Added `onLogout` prop so the parent (Header) controls the
 *   logout flow centrally (redirect, cache clear, etc.).
 */
export function HeaderActions({
  textColor,
  cartItemCount,
  isMobileMenuOpen,
  onMobileMenuToggle,
  isLoggedIn,
  displayName,
  displayInitial,
  onLogout,
}: HeaderActionsProps) {
  // ProfileDropdown open state lives here, not in Header,
  // because only HeaderActions and ProfileDropdown care about it.
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = useCallback(
    () => setIsProfileOpen((prev) => !prev),
    [],
  );
  const closeProfile = useCallback(() => setIsProfileOpen(false), []);

  return (
    <div className="w-48 shrink-0 flex justify-end items-center gap-5">
      <SearchButton textColor={textColor} />
      <CartButton textColor={textColor} itemCount={cartItemCount} />

      {/* Profile dropdown — desktop only (hidden on mobile, handled by MobileMenu) */}
      {isLoggedIn && (
        <ProfileDropdown
          isOpen={isProfileOpen}
          onToggle={toggleProfile}
          onClose={closeProfile}
          fallbackName={displayName}
          fallbackInitial={displayInitial}
          onLogout={onLogout}
          isLoggedIn={isLoggedIn}
        />
      )}

      {/* Mobile hamburger — always last so it stays at the far right */}
      <MobileMenuToggle
        isOpen={isMobileMenuOpen}
        textColor={textColor}
        onToggle={onMobileMenuToggle}
      />
    </div>
  );
}