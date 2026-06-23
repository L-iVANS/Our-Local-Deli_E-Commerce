"use client";

import type { HeroVersion } from "./useHeroVersion";

interface HeaderTheme {
  /** Tailwind text color class for header elements */
  textColor: string;
  /** Whether the header has an opaque background */
  isOpaque: boolean;
}

/**
 * Derives the header text-color and opacity state from scroll position
 * and the current hero version (A = light, B = dark background).
 */
export function useHeaderTheme(
  isScrolled: boolean,
  heroVersion: HeroVersion,
): HeaderTheme {
  const isDarkHero = heroVersion === "B";

  const textColor = isScrolled
    ? "text-secondary"
    : isDarkHero
      ? "text-white"
      : "text-secondary";

  return { textColor, isOpaque: isScrolled };
}
