"use client";

import React from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuToggleProps {
  isOpen: boolean;
  textColor: string;
  onToggle: () => void;
}

/**
 * Hamburger / close toggle for the mobile menu (hidden on desktop).
 */
export function MobileMenuToggle({
  isOpen,
  textColor,
  onToggle,
}: MobileMenuToggleProps) {
  return (
    <button
      className={cn("lg:hidden transition-colors", textColor)}
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? <X size={26} /> : <Menu size={26} />}
    </button>
  );
}
