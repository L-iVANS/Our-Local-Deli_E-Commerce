"use client";

import { useState, useEffect } from "react";

export type HeroVersion = "A" | "B";

/**
 * Listens for the custom `hero-version-change` event dispatched by
 * the hero section toggle and returns the current version.
 */
export function useHeroVersion(forceTheme?: HeroVersion): HeroVersion {
  const [heroVersion, setHeroVersion] = useState<HeroVersion>("B");

  useEffect(() => {
    const handleVersionChange = (e: Event) => {
      const detail = (e as CustomEvent<HeroVersion>).detail;
      setHeroVersion(detail);
    };

    window.addEventListener("hero-version-change", handleVersionChange);
    return () =>
      window.removeEventListener("hero-version-change", handleVersionChange);
  }, []);

  return forceTheme ?? heroVersion;
}
