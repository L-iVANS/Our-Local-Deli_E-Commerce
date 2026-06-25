// src/components/MainRow.tsx

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, ShoppingCart, Menu, MapPin, ChevronDown } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { ProfileDropdown } from "./ProfileDropdown";

interface MainRowProps {
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const MainRow = ({
  isMobileMenuOpen,
  onToggleMobileMenu,
  isLoggedIn = false,
  onLogout = () => {
    console.log("Logout clicked");
    window.location.href = "/login";
  },
}: MainRowProps) => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileToggle = () => setIsProfileDropdownOpen((prev) => !prev);
  const handleProfileClose = () => setIsProfileDropdownOpen(false);

  return (
    <div className="w-full bg-[#0C211C]">
      <div className="container mx-auto px-5 pt-4 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:h-20 gap-4 lg:gap-6">

          {/* ROW 1: MOBILE HEADER / DESKTOP LEFT (LOGO) */}
          <div className="flex items-center justify-between w-full lg:flex-1">
            {/* Hamburger Icon - Mobile Only */}
            <button onClick={onToggleMobileMenu} className="lg:hidden text-[#db9a28]">
              <Menu className="w-7 h-7 stroke-[1.5]" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-16 h-16 lg:w-14 lg:h-14 border border-[#db9a28] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] lg:text-[9px] text-[#db9a28] font-bold">OLD</span>
              </div>
              <div className="hidden lg:block leading-tight">
                <h1 className="text-[#db9a28] font-serif text-lg italic">Our Local</h1>
                <h1 className="text-[#db9a28] font-serif text-lg italic">Deli</h1>
              </div>
            </Link>

            {/* Cart Icon - Mobile Only */}
            <Link href="/cart" className="lg:hidden text-[#C9A96E] relative">
              <ShoppingCart className="w-7 h-7 stroke-[1.5]" />
            </Link>
          </div>

          {/* ROW 2: SEARCH BAR (Center on Desktop) */}
          <div className="w-full lg:flex-[2] lg:flex lg:justify-center">
            <SearchBar />
          </div>

          {/* DESKTOP ONLY ACTIONS (Right side) - Cart → User Profile */}
          <div className="hidden lg:flex lg:flex-1 items-center justify-end gap-6 text-[#db9a28]">

            {/* ✅ CART FIRST */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] hover:text-white transition-colors"
            >
              <ShoppingCart className="w-7 h-7" />
              <span>Cart</span>
            </Link>

            {/* ✅ USER PROFILE SECOND */}
            {isLoggedIn ? (
              <ProfileDropdown
                isOpen={isProfileDropdownOpen}
                onToggle={handleProfileToggle}
                onClose={handleProfileClose}
                fallbackName="User"
                fallbackInitial="U"
                onLogout={() => {
                  handleProfileClose();
                  onLogout();
                }}
                isLoggedIn={true}
              />
            ) : (
              <div className="relative" ref={accountDropdownRef}>
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] hover:text-white transition-colors focus:outline-none"
                >
                  <User className="w-7 h-7" />
                  <span>Account</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isAccountDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isAccountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0C211C] border border-[#db9a28]/30 rounded-xl shadow-xl py-2 z-50">
                    <Link
                      href="/login"
                      className="block px-6 py-3 text-sm hover:bg-[#db9a28]/10 text-white transition-colors"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-6 py-3 text-sm hover:bg-[#db9a28]/10 text-white transition-colors"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ROW 3: DELIVERY INFO (Mobile Only) */}
      <div className="lg:hidden mt-5 bg-[#E6D5B8] py-2 px-6 flex items-center justify-center gap-2 border-t border-black/5">
        <div className="flex items-center justify-center w-5 h-5 rounded-full border border-[#db9a28] flex-shrink-0">
          <MapPin className="w-5 h-5 text-[#db9a28]" />
        </div>
        <span className="text-[11.5px] font-bold text-[#2D261B] tracking-tight">
          Delivering to Metro Manila & Nearby Areas
        </span>
      </div>
    </div>
  );
};