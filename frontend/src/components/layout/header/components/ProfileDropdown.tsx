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
} from "lucide-react";
import { useProfile } from "../hooks/useProfile";

interface ProfileDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  fallbackName: string;
  fallbackInitial: string;
  onLogout: () => void;
  isLoggedIn: boolean;
}

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

export function ProfileDropdown({
  isOpen,
  onToggle,
  onClose,
  fallbackName,
  fallbackInitial,
  onLogout,
  isLoggedIn,
}: ProfileDropdownProps) {
  // ✅ Removed isLoading — we always have fallback data
  const { profile } = useProfile(isLoggedIn);

  const displayName =
    profile?.fullName?.split(" ")[0]?.trim() ||
    profile?.firstName?.trim() ||
    fallbackName;

  const displayEmail = profile?.emailAddress ?? "";

  const displayInitial =
    profile?.fullName?.charAt(0)?.toUpperCase() ||
    profile?.firstName?.charAt(0)?.toUpperCase() ||
    fallbackInitial;

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

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100/60 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* ✅ No spinner — always show the initial */}
        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-semibold shrink-0">
          {displayInitial}
        </div>

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

      {isOpen && (
        <div className="absolute top-full right-0 pt-1 z-50 w-56">
          <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1">
            <DisabledItem icon={<Users size={15} />} label="My Sales Agents" />

            <Link
              href="/consumer/my-orders"
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