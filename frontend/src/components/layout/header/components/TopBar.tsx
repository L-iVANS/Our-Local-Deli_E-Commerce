"use client";

import React from "react";
import { Soup, MapPin } from "lucide-react";

export const TopBar = () => {
  return (
    <div className="border-b border-white/10">
      <div className="container mx-auto px-6 flex items-center justify-between h-9 text-sm">
        {/* Left */}
        <div className="flex items-center gap-2 text-[#db9a28]">
          <Soup className="w-6 h-6 flex-shrink-0" />
          <span className="tracking-wide">
            Premium Filipino Favorites &nbsp;•&nbsp; Carefully Curated for Your Family
          </span>
        </div>

        {/* Right */}
        <div className="hidden sm:flex items-center gap-2 text-[#db9a28]">
          <MapPin className="w-6 h-6 flex-shrink-0" />
          <span className="tracking-wide">
            Delivering to Metro Manila &amp; Nearby Areas
          </span>
        </div>
      </div>
    </div>
  );
};