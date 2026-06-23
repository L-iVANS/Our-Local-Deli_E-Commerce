export interface NavLinkItem {
  name: string;
  href: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { name: "Home", href: "/#hero" },
  { name: "Products", href: "/catalog" },
  { name: "Local Stories", href: "/#local-stories" },
  { name: "About", href: "/#about-us" },
  { name: "Contact Us", href: "/#contact-us" },
];

/** Sections tracked by the scrollspy observer */
export const SCROLLSPY_SECTIONS = [
  "hero",
  "about-us",
  "local-stories",
  "contact-us",
] as const;

/** Scroll threshold (px) before header becomes opaque */
export const SCROLL_THRESHOLD = 50;

/** Time (ms) to suppress scrollspy after a manual navigation click */
export const NAVIGATION_LOCK_MS = 1000;
