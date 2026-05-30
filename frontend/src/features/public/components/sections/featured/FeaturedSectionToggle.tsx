"use client";

import React, { useState } from "react";
import FeaturesSection from "./FeaturesSection";
import FeaturedOffers from "./FeaturedOffers";

export default function FeaturedSectionToggle() {
  const [featuredVersion, setFeaturedVersion] = useState<"A" | "B">("B");

  return (
    <div className="relative w-full">
      {/* Design System Toggle Button - Positioned consistently with Hero toggle */}
      <div className="absolute top-8 right-8 z-50 flex items-center bg-black/40 backdrop-blur-md rounded-full shadow-lg overflow-hidden border border-white/10 p-0.5">
        <button
          onClick={() => setFeaturedVersion("A")}
          className={`px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-[10px] font-bold transition-all rounded-full cursor-pointer ${featuredVersion === "A" ? "bg-primary text-white" : "text-white/40 hover:text-white"}`}
        >
          VER. A
        </button>
        <button
          onClick={() => setFeaturedVersion("B")}
          className={`px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-[10px] font-bold transition-all rounded-full cursor-pointer ${featuredVersion === "B" ? "bg-primary text-white" : "text-white/40 hover:text-white"}`}
        >
          VER. B
        </button>
      </div>

      {/* Render the selected version */}
      <div className="w-full">
        {featuredVersion === "A" ? <FeaturesSection /> : <FeaturedOffers />}
      </div>
    </div>
  );
}
