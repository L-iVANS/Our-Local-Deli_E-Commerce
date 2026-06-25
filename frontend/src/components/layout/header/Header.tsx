"use client";

import React, { useState, useCallback } from "react";
import { TopBar } from "./components/TopBar";
import { MainRow } from "./components/MainRow";
import { NavRow } from "./components/NavRow";
import { MobileMenu } from "./components/MobileMenu";
import { useScrollState } from "./hooks/useScrollState";
import { useAuth } from "@/features/auth/hooks/useAuth"; // ✅ exact path

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollState();

  const { isLoggedIn, logout } = useAuth();

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    [],
  );

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0C211C] transition-all duration-300 shadow-md">
      <div className="hidden lg:block">
        <TopBar />
      </div>
      <MainRow
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <NavRow />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
};

export default Header;