"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { usePathname } from "next/navigation";
// import { Logo } from "@/src/components/ui/Logo";

const NavLinks = [
  { name: "Home", href: "/#hero" },
  { name: "Products", href: "/catalog" },
  { name: "Local Stories", href: "/#local-stories" },
  { name: "About", href: "/#about-us" },
  { name: "Contact Us", href: "/#contact-us" },
];

interface HeaderProps {
  forceTheme?: "A" | "B";
}

const Header = ({ forceTheme }: HeaderProps) => {
  // UI-only build: cart backend not wired yet.
  // TODO: replace placeholder with real cart context/provider when backend is ready.
  const itemCount = 0;

  const [isScrolled, setIsScrolled] = useState(false);
  const [heroVersion, setHeroVersion] = useState<"A" | "B">("B");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // ✅ Hook called inside component

  // Active section tracking for scrollspy
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");

      return pathname === "/" && activeSection === sectionId;
    }

    return pathname === href;
  };

  // useEffect for scrollspy and hero version tracking
  useEffect(() => {
    const sections = ["hero", "about-us", "local-stories", "contact-us"];

    const observer = new IntersectionObserver(
      (entries) => {
        if (isNavigating) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.4,
        rootMargin: "-100px 0px -40% 0px",
      },
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleVersionChange = (e: any) => {
      setHeroVersion(e.detail);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("hero-version-change", handleVersionChange);

    // Check initial version if possible (assuming B as default from toggle component)
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hero-version-change", handleVersionChange);
    };
  }, []);

  const isDarkHero = (forceTheme || heroVersion) === "B";
  const headerTextColor = isScrolled
    ? "text-secondary"
    : isDarkHero
      ? "text-white"
      : "text-secondary";

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("/#") && window.location.pathname === "/") {
      e.preventDefault();

      const id = href.replace("/#", "");
      const element = document.getElementById(id);

      if (element) {
        setIsNavigating(true);

        // Immediately highlight the clicked nav item
        setActiveSection(id);

        element.scrollIntoView({
          behavior: "smooth",
        });

        window.history.pushState(null, "", href);

        setTimeout(() => {
          setIsNavigating(false);
        }, 1000); // adjust if needed
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-100 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-6 flex items-center">
        {/* Reserved Logo Space */}
        <div className="w-48 shrink-0">{/* Empty until logo is ready */}</div>

        {/* Desktop Nav */}
        {/* Center Navigation */}
        <div className="flex-1 flex justify-center">
          <nav className="hidden lg:flex items-center gap-8">
            {NavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={cn(
                  "text-lg font-medium py-2 transition-colors",
                  isActiveLink(link.href) ? "text-accent" : headerTextColor,
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="w-48 shrink-0 flex justify-end items-center gap-5">
          <button
            className={cn(
              "transition-colors hover:text-accent",
              headerTextColor,
            )}
          >
            <Search size={22} />
          </button>
          <button
            className={cn(
              "transition-colors hover:text-accent relative",
              headerTextColor,
            )}
          >
            {/* Cart - always visible */}
            <div className="relative">
              <Link
                href="/consumer/cart"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium text-#ffffff-700 hover:border-gray-300 transition-colors"
              >
                <ShoppingCart size={15} />
              </Link>
              {itemCount > 0 && (
                <span
                  className="absolute -top-2 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: "#e11d48" }}
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </div>
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
          <button
            className={cn("lg:hidden transition-colors", headerTextColor)}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
          {NavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-lg font-medium py-2 border-b border-gray-50 flex justify-between items-center",
                isActiveLink(link.href) ? "text-secondary" : "text-accent", // ✅ changed
              )}
              onClick={(e) => {
                handleAnchorClick(e, link.href);
                setIsMobileMenuOpen(false);
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
