"use client";

import { useState, useEffect } from "react";

/**
 * Returns true when the page has been scrolled past the threshold.
 */
export const useScrollState = (threshold = 10): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    // Set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
};