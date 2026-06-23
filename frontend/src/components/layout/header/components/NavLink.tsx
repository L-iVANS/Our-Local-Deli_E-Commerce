"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  name: string;
  href: string;
  isActive: boolean;
  textColor: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  className?: string;
}

/**
 * A single navigation link with active-state styling.
 */
export function NavLink({
  name,
  href,
  isActive,
  textColor,
  onClick,
  className,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={(e) => onClick?.(e, href)}
      className={cn(
        "text-lg font-medium py-2 transition-colors",
        isActive ? "text-accent" : textColor,
        className,
      )}
    >
      {name}
    </Link>
  );
}
