"use client";

import React from "react";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-3 flex-shrink-0 w-52 group">
      {/* Circle Badge */}
      <div className="relative w-14 h-14 rounded-full border-2 border-[#C9A96E] flex items-center justify-center flex-shrink-0 overflow-hidden">
        <div className="text-center leading-none">
          <span className="block font-sans text-[6px] text-[#C9A96E] tracking-[0.15em] uppercase">
            Our Local Deli
          </span>
          <div className="w-6 h-px bg-[#C9A96E] mx-auto my-1" />
          <span
            className="block font-serif italic text-[13px] text-[#C9A96E] leading-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            OLD
          </span>
          <div className="w-6 h-px bg-[#C9A96E] mx-auto my-1" />
          <span className="block font-sans text-[5.5px] text-[#C9A96E] tracking-[0.1em] uppercase">
            Est. 2020
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span
          className="text-[#C9A96E] text-[22px] leading-tight tracking-[0.5px] group-hover:text-[#D9B56A] transition-colors"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
        >
          Our Local Deli
        </span>
        <span className="text-[9px] text-[#C9A96E]/65 uppercase tracking-[0.18em] mt-0.5">
          Curated Filipino Favorites
        </span>
      </div>
    </Link>
  );
};