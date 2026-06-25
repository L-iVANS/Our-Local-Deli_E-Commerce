"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth";

import {
  useScrollState,
  useHeroVersion,
  useScrollSpy,
  useHeaderTheme,
  useDisplayName,
} from "./hooks/hooks.index";
import type { HeroVersion } from "./hooks/hooks.index";

import { DesktopNav, MobileMenu, HeaderActions } from "./components";

interface HeaderProps {
  forceTheme?: HeroVersion;
}

const Header = ({ forceTheme }: HeaderProps) => {
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isScrolled = useScrollState();
  const heroVersion = useHeroVersion(forceTheme);
  const { textColor } = useHeaderTheme(isScrolled, heroVersion);
  const { isActiveLink, handleAnchorClick } = useScrollSpy();

  const { isLoggedIn, user, logout } = useAuth();
  const { displayName, displayInitial } = useDisplayName(user);

  const cartItemCount = 0;

  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    [],
  );

  const closeMobileMenu = useCallback(
    () => setIsMobileMenuOpen(false),
    [],
  );

  const handleLogout = useCallback(async () => {
    await logout(); // ✅ already handles redirect via window.location.href
  }, [logout]);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-6 flex items-center">
        <div className="w-48 shrink-0">{/* Empty until logo is ready */}</div>

        <DesktopNav
          textColor={textColor}
          isActiveLink={isActiveLink}
          onAnchorClick={handleAnchorClick}
        />

        <HeaderActions
          textColor={textColor}
          cartItemCount={cartItemCount}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={toggleMobileMenu}
          isLoggedIn={isLoggedIn}
          displayName={displayName}
          displayInitial={displayInitial}
          onLogout={handleLogout}
        />
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        isActiveLink={isActiveLink}
        onAnchorClick={handleAnchorClick}
        onClose={closeMobileMenu}
      />
    </header>
  );
};

export default Header;