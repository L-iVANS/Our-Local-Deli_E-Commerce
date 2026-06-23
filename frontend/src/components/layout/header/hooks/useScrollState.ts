"use client";

import { useState, useEffect } from "react";
import { SCROLL_THRESHOLD } from "../constants";

/**
 * Returns `true` once the user has scrolled past the configured threshold.
 */
export function useScrollState(): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    // Check initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isScrolled;
}
