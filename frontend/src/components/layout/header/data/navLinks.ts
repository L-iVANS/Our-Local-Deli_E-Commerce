export interface NavChild {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV_LINKS: NavLink[] = [
  {
    label: "HOME",
    href: "/",
  },
  {
    label: "SHOP",
    href: "/shop",
    children: [
      { label: "All Products", href: "/catalog" },
      { label: "New Arrivals", href: "/shop/new-arrivals" },
      { label: "Best Sellers", href: "/shop/best-sellers" },
    ],
  },
  {
    label: "PANTRY",
    href: "/pantry",
    children: [
      { label: "Condiments", href: "/pantry/condiments" },
      { label: "Snacks", href: "/pantry/snacks" },
      { label: "Canned Goods", href: "/pantry/canned-goods" },
    ],
  },
  {
    label: "BREAKFAST",
    href: "/breakfast",
  },
  {
    label: "READY TO COOK",
    href: "/ready-to-cook",
    children: [
      { label: "Marinated Meats", href: "/ready-to-cook/marinated" },
      { label: "Meal Kits", href: "/ready-to-cook/meal-kits" },
      { label: "Sauces & Marinades", href: "/ready-to-cook/sauces" },
    ],
  },
  {
    label: "FROZEN",
    href: "/frozen",
    children: [
      { label: "Frozen Meals", href: "/frozen/meals" },
      { label: "Seafood", href: "/frozen/seafood" },
      { label: "Meats", href: "/frozen/meats" },
    ],
  },
  {
    label: "ABOUT US",
    href: "/about",
  },
  {
    label: "CONTACT",
    href: "/contact",
  },
];