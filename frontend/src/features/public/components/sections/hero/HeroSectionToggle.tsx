"use client";

import React, { useState } from "react";
import Hero from "./Hero";
import HeroB from "./HeroB";
import { HeroData } from "@/src/data/heroData";

export default function HeroSectionToggle({ data }: { data: HeroData }) {
  // We'll set the initial state to 'B' so the user can immediately see the new feature upon load.
  const [heroVersion, setHeroVersion] = useState<"A" | "B">("B");

  // Sync version with header
  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent("hero-version-change", { detail: heroVersion }));
  }, [heroVersion]);

  return (
    <div id="hero" className="relative w-full pointer-events-none">
      {/* Minimal Toggle Button - High Index z-[100] */}
      <div className="absolute bottom-8 right-8 z-[100] flex items-center bg-black/40 backdrop-blur-md rounded-full shadow-lg overflow-hidden border border-white/10 p-0.5 pointer-events-auto">
        <button
          onClick={() => setHeroVersion("A")}
          className={`px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-[10px] font-bold transition-all rounded-full cursor-pointer ${heroVersion === "A" ? "bg-primary text-white" : "text-white/40 hover:text-white"}`}
        >
          VER. A
        </button>
        <button
          onClick={() => setHeroVersion("B")}
          className={`px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-[10px] font-bold transition-all rounded-full cursor-pointer ${heroVersion === "B" ? "bg-primary text-white" : "text-white/40 hover:text-white"}`}
        >
          VER. B
        </button>
      </div>


      {/* Hero Content - Lower Index z-10 */}
      <div className="w-full h-full relative z-10 pointer-events-auto">
        {heroVersion === "A" ? <Hero data={data.versionA} /> : <HeroB data={data.versionB} />}
      </div>
    </div>

  );
}