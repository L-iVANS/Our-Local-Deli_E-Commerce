"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Users,
  Package,
  FileText,
  UserCircle,
  KeyRound,
  LogOut,
  Loader2,
} from "lucide-react";
import { useProfile } from "../hooks/useProfile";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface ProfileDropdownProps {
  /** Controls open/close state (owned by HeaderActions). */
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;

  /**
   * Fallback values from useAuth / useDisplayName.
   * Shown immediately while the enriched profile is loading.
   */
  fallbackName: string;
  fallbackInitial: string;

  /** Called when the user clicks Logout. */
  onLogout: () => void;

  /** Whether the user is currently logged in (gates the fetch). */
  isLoggedIn: boolean;
}

// ─────────────────────────────────────────────────────────────
// Disabled menu item — reusable so styles stay in sync
// ─────────────────────────────────────────────────────────────

function DisabledItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 cursor-not-allowed opacity-50 select-none">
      {icon}
      {label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

/**
 * Profile dropdown trigger + panel.
 *
 * Fetches enriched profile data from GET /users/profile via
 * TanStack Query. Falls back gracefully to the values already
 * in useAuth while the request is in flight.
 *
 * Close-on-outside-click is handled internally via a ref so
 * the parent doesn't need to set up its own listener.
 */
export function ProfileDropdown({
  isOpen,
  onToggle,
  onClose,
  fallbackName,
  fallbackInitial,
  onLogout,
  isLoggedIn,
}: ProfileDropdownProps) {
  // ── Enriched profile fetch ─────────────────────────────────
  const { profile, isLoading } = useProfile(isLoggedIn);

  // ── Derived display values ─────────────────────────────────
  // Priority: enriched API data → fallback from useAuth/useDisplayName
  const displayName =
    profile?.fullName?.split(" ")[0]?.trim() ||
    profile?.firstName?.trim() ||
    fallbackName;

  const displayEmail = profile?.emailAddress ?? "";

  const displayInitial =
    profile?.fullName?.charAt(0)?.toUpperCase() ||
    profile?.firstName?.charAt(0)?.toUpperCase() ||
    fallbackInitial;

  // ── Close on outside click ─────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  // ── Render ─────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative hidden sm:block">
      {/* ── Trigger button ── */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100/60 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-semibold shrink-0">
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            displayInitial
          )}
        </div>

        {/* Name + email */}
        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-medium text-accent">
            {displayName}
          </span>
          {displayEmail && (
            <span className="text-xs text-accent truncate max-w-[7.5rem]">
              {displayEmail}
            </span>
          )}
        </div>

        <ChevronDown
          size={12}
          className={`text-accent transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div className="absolute top-full right-0 pt-1 z-50 w-56">
          <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1">
            {/* — Disabled items (coming soon) — */}
            <DisabledItem icon={<Users size={15} />} label="My Sales Agents" />

            {/*
             * TODO: Update this path when the orders page is ready.
             * Currently points to /orders as a placeholder.
             */}
            <Link
              href="/orders"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Package size={15} className="text-gray-400" />
              My Orders History
            </Link>

            <DisabledItem icon={<FileText size={15} />} label="My Invoices" />

            <DisabledItem
              icon={<UserCircle size={15} />}
              label="Update Profile"
            />

            <DisabledItem
              icon={<KeyRound size={15} />}
              label="Change Password"
            />

            {/* — Logout — */}
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} className="text-red-400" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
