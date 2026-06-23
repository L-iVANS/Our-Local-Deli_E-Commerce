"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { SCROLLSPY_SECTIONS, NAVIGATION_LOCK_MS } from "../constants";

interface ScrollspyReturn {
  activeSection: string;
  isActiveLink: (href: string) => boolean;
  handleAnchorClick: (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => void;
}

/**
 * Tracks which section is currently in the viewport and provides
 * a handler for smooth-scrolling anchor clicks.
 */
export function useScrollSpy(): ScrollspyReturn {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("hero");
  const isNavigatingRef = useRef(false);

  // IntersectionObserver-based scrollspy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isNavigatingRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.4,
        rootMargin: "-100px 0px -40% 0px",
      },
    );

    SCROLLSPY_SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const isActiveLink = useCallback(
    (href: string): boolean => {
      if (href.startsWith("/#")) {
        const sectionId = href.replace("/#", "");
        return pathname === "/" && activeSection === sectionId;
      }
      return pathname === href;
    },
    [pathname, activeSection],
  );

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith("/#") && window.location.pathname === "/") {
        e.preventDefault();

        const id = href.replace("/#", "");
        const element = document.getElementById(id);

        if (element) {
          isNavigatingRef.current = true;
          setActiveSection(id);

          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);

          setTimeout(() => {
            isNavigatingRef.current = false;
          }, NAVIGATION_LOCK_MS);
        }
      }
    },
    [],
  );

  return { activeSection, isActiveLink, handleAnchorClick };
}
