"use client";

import React from "react";
import { NAV_LINKS } from "../constants";
import { NavLink } from "./NavLink";

interface DesktopNavProps {
  textColor: string;
  isActiveLink: (href: string) => boolean;
  onAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

/**
 * Horizontally-centered desktop navigation bar (hidden on mobile).
 */
export function DesktopNav({
  textColor,
  isActiveLink,
  onAnchorClick,
}: DesktopNavProps) {
  return (
    <div className="flex-1 flex justify-center">
      <nav className="hidden lg:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.name}
            name={link.name}
            href={link.href}
            isActive={isActiveLink(link.href)}
            textColor={textColor}
            onClick={onAnchorClick}
          />
        ))}
      </nav>
    </div>
  );
}
