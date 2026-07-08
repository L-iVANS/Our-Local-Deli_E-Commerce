"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sprout, Star, Heart, Truck, LucideIcon } from "lucide-react";

/**
 * WhyChooseUs
 * ------------------------------------------------------------------
 * Replaces the previous "Our Local Deli Stories" section.
 * ------------------------------------------------------------------
 * Structural notes:
 * 1. Data is defined INLINE (FEATURES const) rather than in a
 *    separate data file. Rationale: 4 static value-prop items with
 *    no CMS/DB backing and no reuse elsewhere — externalizing would
 *    add indirection without benefit. Promote to a data file only
 *    if this content becomes editable or shared.
 * 2. Icons come from lucide-react to stay consistent with the icon
 *    library already used elsewhere in this file tree (Leaf,
 *    ShieldCheck, ChefHat in BestSeller etc.). No new dependency.
 * 3. Cream/beige background (#F5EEE0-ish) + gold flourishes + dark
 *    green text — matches the palette used in CategoryStrip /
 *    BestSeller so all three sections read as one visual system.
 * 4. Uses the SAME LeafFlourish SVG shape as CategoryStrip and
 *    BestSeller. Duplicated locally here for now — flagging that
 *    this is the 3rd use, so it should be extracted into a shared
 *    `components/ui/LeafFlourish.tsx` in a follow-up.
 * 5. Vertical divider lines between columns are done with a right
 *    border on all but the last column (`last:border-r-0`) — no
 *    extra divider elements needed.
 * ------------------------------------------------------------------
 */

// Shared palette — matches other sections. Move to theme tokens when
// the design system is formalized.
const GOLD = "#C9A34E";
const DARK_GREEN = "#0d2818";
const CREAM_BG = "#F5EEE0";

/**
 * Leaf-branch flourish — same shape used in CategoryStrip + BestSeller.
 * TODO: extract to shared `components/ui/LeafFlourish.tsx` — this is
 * the 3rd copy.
 */
const LeafFlourish = ({ mirrored = false }: { mirrored?: boolean }) => (
  <svg
    width="46"
    height="18"
    viewBox="0 0 46 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={mirrored ? "scale-x-[-1]" : ""}
    style={{ color: GOLD }}
  >
    <path d="M2 9 C 14 9, 26 9, 44 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 8 C 14 3, 19 2, 22 5 C 19 7, 15 8, 12 8 Z" fill="currentColor" opacity="0.9" />
    <path d="M24 7 C 26 3, 30 2.5, 33 5 C 30 7, 27 7.5, 24 7 Z" fill="currentColor" opacity="0.75" />
    <path d="M14 10 C 16 15, 21 16, 24 13 C 21 11, 17 10, 14 10 Z" fill="currentColor" opacity="0.75" />
    <path d="M26 11 C 28 15, 32 15.5, 35 13 C 32 11, 29 10.5, 26 11 Z" fill="currentColor" opacity="0.9" />
  </svg>
);

/**
 * Feature item shape. Icon is a lucide component reference (not JSX)
 * so size/stroke can be applied at render time from one source.
 */
type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: Sprout,
    title: "Better Choices",
    description: "We choose only the products we would serve our own family.",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Carefully sourced and made with the best ingredients.",
  },
  {
    icon: Heart,
    title: "Support Local",
    description: "We partner with trusted Filipino makers and small businesses.",
  },
  {
    icon: Truck,
    title: "Convenient Delivery",
    description: "Delivered frozen or pantry-ready right to your doorstep.",
  },
];

const WhyChooseUs = () => {
  return (
    <section
      id="why-choose-us"
      className="py-12 md:py-16 overflow-hidden"
      style={{ backgroundColor: CREAM_BG }}
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* ---------------------------------------------------------
            Heading with matching gold leaf flourishes.
        --------------------------------------------------------- */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-10 md:mb-14">
          <LeafFlourish />
          <h2
            className="font-serif text-lg md:text-2xl tracking-[0.2em] uppercase"
            style={{ color: DARK_GREEN }}
          >
            Why Choose Our Local Deli?
          </h2>
          <LeafFlourish mirrored />
        </div>

        {/* ---------------------------------------------------------
            Feature grid.
            - Mobile: 1 column stacked, no dividers (dividers only
              make sense in a horizontal layout).
            - Tablet: 2 columns.
            - Desktop: 4 columns with vertical gold dividers between
              them. Divider is a right border, suppressed on the last
              item via `md:last:border-r-0`.
        --------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-y-0">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-5 px-4 md:px-8
                           md:border-r md:last:border-r-0"
                style={{
                  // Border color needs the JS constant, not a
                  // Tailwind class, since GOLD lives in JS.
                  borderColor: `${GOLD}55`, // ~33% alpha for subtle divider
                }}
              >
                {/* Icon column — fixed width so text alignment
                    stays consistent across all 4 cards regardless
                    of icon shape. */}
                <div className="shrink-0" style={{ color: DARK_GREEN }}>
                  <Icon size={44} strokeWidth={1.25} />
                </div>

                {/* Text column */}
                <div className="flex flex-col gap-1.5">
                  <h3
                    className="font-bold text-sm tracking-[0.15em] uppercase"
                    style={{ color: DARK_GREEN }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: `${DARK_GREEN}CC` }} // ~80% alpha
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;