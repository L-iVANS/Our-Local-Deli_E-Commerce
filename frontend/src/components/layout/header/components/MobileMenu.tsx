"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NAV_LINKS } from "../data/navLinks";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const pathname = usePathname();
  const [openSection, setOpenSection] = React.useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-white/10 bg-[#0C211C]">
      <nav className="container mx-auto px-6 py-4">
        <ul className="flex flex-col gap-1 list-none m-0 p-0">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            const isSectionOpen = openSection === link.label;

            return (
              <li key={link.href}>
                {link.children ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenSection(isSectionOpen ? null : link.label)
                      }
                      className={`
                        w-full flex items-center justify-between px-2 py-3
                        text-sm font-semibold tracking-[0.08em]
                        border-b border-white/5 transition-colors
                        ${isActive ? "text-white" : "text-[#C9A96E]"}
                      `}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isSectionOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isSectionOpen && (
                      <ul className="pl-4 py-1 list-none">
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className="block py-2 px-2 text-sm text-[#C9A96E]/80 hover:text-white transition-colors"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`
                      block px-2 py-3 text-sm font-semibold tracking-[0.08em]
                      border-b border-white/5 transition-colors
                      ${isActive ? "text-white" : "text-[#C9A96E] hover:text-white"}
                    `}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};