"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NAV_LINKS, type NavLink } from "../data/navLinks";

const DropdownMenu = ({ items }: { items: { label: string; href: string }[] }) => (
  <div
    className="
      absolute top-full left-0 mt-0 bg-[#0C211C]
      border border-[#C9A96E]/25 rounded-md py-1.5
      min-w-[148px] z-50 shadow-lg
    "
  >
    {items.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="
          block px-4 py-2 text-[11.5px] font-medium tracking-[0.05em]
          text-[#C9A96E] hover:text-white hover:bg-[#C9A96E]/10
          transition-colors whitespace-nowrap
        "
      >
        {item.label}
      </Link>
    ))}
  </div>
);

const NavItem = ({ link }: { link: NavLink }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClasses = `
    relative flex items-center gap-1 px-3.5 h-12
    text-[11.5px] font-semibold tracking-[0.08em] whitespace-nowrap
    transition-colors duration-200
    ${isActive ? "text-white" : "text-[#C9A96E] hover:text-white"}
  `;

  const activeUnderline = isActive ? (
    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#C9A96E] rounded-t-sm" />
  ) : null;

  if (link.children) {
    return (
      <li
        ref={ref}
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          onClick={() => setIsOpen((p) => !p)}
          className={linkClasses}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {link.label}
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
          {activeUnderline}
        </button>
        {isOpen && <DropdownMenu items={link.children} />}
      </li>
    );
  }

  return (
    <li className="relative">
      <Link href={link.href} className={linkClasses}>
        {link.label}
        {activeUnderline}
      </Link>
    </li>
  );
};

export const NavRow = () => {
  return (
    <div className="hidden lg:block border-t border-white/10">
      <div className="container mx-auto px-6">
        <nav aria-label="Main navigation">
          <ul className="flex items-center justify-center h-12 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <NavItem key={link.href} link={link} />
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};