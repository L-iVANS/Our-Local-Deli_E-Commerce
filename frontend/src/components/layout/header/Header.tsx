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
  /** Lock the hero colour scheme to A (light) or B (dark). */
  forceTheme?: HeroVersion;
}

const Header = ({ forceTheme }: HeaderProps) => {
  const router = useRouter();

  // ── State & hooks ──────────────────────────────────────────
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isScrolled = useScrollState();
  const heroVersion = useHeroVersion(forceTheme);
  const { textColor } = useHeaderTheme(isScrolled, heroVersion);
  const { isActiveLink, handleAnchorClick } = useScrollSpy();

  // Auth
  const { isLoggedIn, user, logout } = useAuth(); // <- add logout here
  const { displayName, displayInitial } = useDisplayName(user);

  // Cart (placeholder until backend is wired)
  const cartItemCount = 0;

  // ── Handlers ───────────────────────────────────────────────
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    [],
  );
  const closeMobileMenu = useCallback(
    () => setIsMobileMenuOpen(false),
    [],
  );

  const handleLogout = useCallback(async () => {
    await logout();
    closeMobileMenu(); // close mobile menu if open
    router.push("/");
    router.refresh();
  }, [logout, router, closeMobileMenu]);

  // ── Render ─────────────────────────────────────────────────
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
        {/* Logo placeholder */}
        <div className="w-48 shrink-0">{/* Empty until logo is ready */}</div>

        {/* Desktop navigation */}
        <DesktopNav
          textColor={textColor}
          isActiveLink={isActiveLink}
          onAnchorClick={handleAnchorClick}
        />

        {/* Right-side actions */}
        <HeaderActions
          textColor={textColor}
          cartItemCount={cartItemCount}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={toggleMobileMenu}
          isLoggedIn={isLoggedIn}
          displayName={displayName}
          displayInitial={displayInitial}
          onLogout={handleLogout}  // <- this was missing
        />
      </div>

      {/* Mobile menu */}
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