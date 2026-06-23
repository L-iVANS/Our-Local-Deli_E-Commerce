"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "../constants";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface MobileMenuProps {
  isOpen: boolean;
  isActiveLink: (href: string) => boolean;
  onAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onClose: () => void;

  // Auth — optional so MobileMenu stays usable on public pages
  // where the user isn't logged in yet.
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

/**
 * Slide-down mobile navigation menu rendered below the header.
 *
 * Changes from previous version:
 * - Added an optional authenticated section at the bottom that
 *   shows quick links (Orders) and a Logout button when the
 *   user is logged in. Mirrors the desktop ProfileDropdown items
 *   so both surfaces stay consistent.
 * - `isLoggedIn` and `onLogout` are optional with safe defaults
 *   so existing callers don't break if they haven't added them yet.
 */
export function MobileMenu({
  isOpen,
  isActiveLink,
  onAnchorClick,
  onClose,
  isLoggedIn = false,
  onLogout,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">

      {/* ── Nav links (unchanged) ── */}
      {NAV_LINKS.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            "text-lg font-medium py-2 border-b border-gray-50 flex justify-between items-center",
            isActiveLink(link.href) ? "text-accent" : "text-secondary",
          )}
          onClick={(e) => {
            onAnchorClick(e, link.href);
            onClose();
          }}
        >
          {link.name}
        </Link>
      ))}

      {/* ── Authenticated section ── */}
      {/*
       * Only rendered when the user is logged in.
       * Items here should mirror what's in ProfileDropdown
       * so both desktop and mobile stay in sync.
       *
       * TODO: Add remaining items (Invoices, Update Profile,
       * Change Password) once those pages are built.
       */}
      {isLoggedIn && (
        <div className="border-t border-gray-100 pt-4 flex flex-col gap-1">
          {/* Orders — only active link here for now */}
          <Link
            href="/orders"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package size={15} className="text-gray-400" />
            My Orders History
          </Link>

          {/* Logout */}
          <button
            onClick={() => {
              onClose();
              onLogout?.(); // safe call — onLogout is optional
            }}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={15} className="text-red-400" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}