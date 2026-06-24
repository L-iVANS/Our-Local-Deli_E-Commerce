"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { UserCircle } from "lucide-react";
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
 * - Added Login / Sign up buttons for logged-out users (desktop only).
 * - Login button now shows a user icon wrapped in a white border.
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
      {/* <SearchButton textColor={textColor} /> */}
      {isLoggedIn && (
        <CartButton textColor={textColor} itemCount={cartItemCount} />
      )}

      {/* ── Auth section — desktop only ── */}
      {isLoggedIn ? (
        // Logged-in: show profile dropdown
        <ProfileDropdown
          isOpen={isProfileOpen}
          onToggle={toggleProfile}
          onClose={closeProfile}
          fallbackName={displayName}
          fallbackInitial={displayInitial}
          onLogout={onLogout}
          isLoggedIn={isLoggedIn}
        />
      ) : (
        // Logged-out: user icon + "Log in" wrapped in a white border
        <div className="hidden md:flex items-center">
          <Link
            href="/login"
            className={`
              flex items-center gap-2
              text-sm font-medium px-4 py-1.5 rounded-full
              border border-white
              hover:bg-white/10
              transition-colors
              ${textColor}
            `}
          >
            <UserCircle className="w-5 h-5 shrink-0" />
            Log in
          </Link>
        </div>
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