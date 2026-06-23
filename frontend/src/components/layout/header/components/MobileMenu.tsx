"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "../constants";

interface MobileMenuProps {
  isOpen: boolean;
  isActiveLink: (href: string) => boolean;
  onAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onClose: () => void;
}

/**
 * Slide-down mobile navigation menu, rendered below the header.
 */
export function MobileMenu({
  isOpen,
  isActiveLink,
  onAnchorClick,
  onClose,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
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
    </div>
  );
}
