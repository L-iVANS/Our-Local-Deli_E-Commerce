"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHorizontalScroller } from "./hooks/useHorizontalScroller";
import { CategoryData } from "@/src/data/categoriesData";

/**
 * CategoryStrip
 * ------------------------------------------------------------------
 * Refined pass — matches gold-accent reference design.
 * ------------------------------------------------------------------
 * Changes vs. prior lo-fi pass:
 * 1. Flourish glyphs replaced with inline gold leaf SVGs (mirrored
 *    on the right). Self-contained — no asset pipeline needed, and
 *    color is controlled via `currentColor` so theming is trivial.
 * 2. Circle avatars now use a warm gold ring instead of the previous
 *    primary/40 border. Double-ring effect (outer thin ring + inner
 *    border) gives the "framed" look from the reference without
 *    needing an extra wrapper element per item.
 * 3. Label typography tightened: smaller tracking-wider caps sitting
 *    directly under the circle, matching reference proportions.
 * ------------------------------------------------------------------
 */

// Gold accent used across flourish + rings. Kept as a constant so
// it's a one-line change if brand gold shifts, and so Tailwind's
// JIT picks up the arbitrary value only once.
const GOLD = "#C9A34E";

// Decorative leaf-branch flourish, matches reference design.
// `mirrored` flips it horizontally for the right-hand side so the
// pair reads as a symmetric frame around the heading.
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
    {/* Stem */}
    <path
      d="M2 9 C 14 9, 26 9, 44 9"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Upper leaves */}
    <path
      d="M12 8 C 14 3, 19 2, 22 5 C 19 7, 15 8, 12 8 Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M24 7 C 26 3, 30 2.5, 33 5 C 30 7, 27 7.5, 24 7 Z"
      fill="currentColor"
      opacity="0.75"
    />
    {/* Lower leaves */}
    <path
      d="M14 10 C 16 15, 21 16, 24 13 C 21 11, 17 10, 14 10 Z"
      fill="currentColor"
      opacity="0.75"
    />
    <path
      d="M26 11 C 28 15, 32 15.5, 35 13 C 32 11, 29 10.5, 26 11 Z"
      fill="currentColor"
      opacity="0.9"
    />
  </svg>
);

const CategoryStrip = ({ categories }: { categories: CategoryData[] }) => {
  const {
    scrollRef,
    canScrollPrev,
    canScrollNext,
    scrollProgress,
    scrollPrev,
    scrollNext,
  } = useHorizontalScroller();

  return (
    <section className="relative w-full bg-[#F9F3EE] py-10 md:py-16">
      <div className="w-full max-w-full px-4 md:container md:mx-auto md:px-6">
        {/* ---------------------------------------------------------
            Heading with gold leaf flourishes on either side.
            Flourishes are inline SVG (see LeafFlourish above) so
            they scale cleanly and inherit color from the GOLD const.
        --------------------------------------------------------- */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-10">
          <LeafFlourish />
          <h2 className="font-serif text-xl md:text-3xl tracking-[0.15em] text-secondary uppercase">
            Shop By Category
          </h2>
          <LeafFlourish mirrored />
        </div>

        {/* ---------------------------------------------------------
            Row wrapper: relative, so chevrons can be absolutely
            positioned over it without affecting scroll content.
        --------------------------------------------------------- */}
        <div className="relative">
          {/* Prev / Next buttons — desktop only. See prior notes on
              why mobile intentionally has none. */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Scroll categories left"
            className="hidden md:flex absolute -left-5 top-[38%] -translate-y-1/2 z-10
                       w-11 h-11 rounded-full bg-white shadow-md border border-neutral-200
                       items-center justify-center text-secondary
                       hover:bg-primary hover:text-white transition-colors active:scale-95
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                       disabled:hover:bg-white disabled:hover:text-secondary"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Scroll categories right"
            className="hidden md:flex absolute -right-5 top-[38%] -translate-y-1/2 z-10
                       w-11 h-11 rounded-full bg-white shadow-md border border-neutral-200
                       items-center justify-center text-secondary
                       hover:bg-primary hover:text-white transition-colors active:scale-95
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                       disabled:hover:bg-white disabled:hover:text-secondary"
          >
            <ChevronRight size={20} />
          </button>

          {/* ---------------------------------------------------------
              Scrollable row — see prior notes on scroll-snap choice.
          --------------------------------------------------------- */}
          <div
            ref={scrollRef}
            className="flex gap-5 md:gap-10 overflow-x-auto scroll-smooth snap-x snap-mandatory
                       [-ms-overflow-style:none] [scrollbar-width:none]
                       [&::-webkit-scrollbar]:hidden
                       pb-2"
          >
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="group flex flex-col items-center gap-3 shrink-0 snap-start
                           w-[28vw] max-w-[130px] md:w-[150px] md:max-w-none"
              >
                {/* ---------------------------------------------
                    Circle avatar with double gold ring.
                    - Outer wrapper: thin gold ring + small padding
                      that creates the "framed" gap between ring
                      and image seen in the reference.
                    - Inner div: the actual image mask (rounded-full
                      overflow-hidden). Kept separate so the outer
                      ring never gets clipped by overflow-hidden.
                --------------------------------------------------- */}
                <div
                  className="relative aspect-square w-full rounded-full p-[3px]
                             shadow-sm"
                  style={{
                    // Ring color derived from the gold constant.
                    // Using boxShadow instead of `border` so the ring
                    // sits *outside* the padding, giving the crisp
                    // thin-ring look from the reference.
                    boxShadow: `0 0 0 1px ${GOLD}`,
                  }}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-neutral-200">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover
                                   transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      // Fallback skeleton — used only when no image exists yet.
                      <div className="absolute inset-0 animate-pulse bg-neutral-300" />
                    )}
                  </div>
                </div>

                <span
                  className="font-serif text-[11px] md:text-sm text-center leading-tight
                             tracking-[0.15em] text-secondary uppercase"
                >
                  {category.name}
                </span>
              </a>
            ))}
          </div>

          {/* ---------------------------------------------------------
              Mobile-only scroll progress bar — see prior notes.
          --------------------------------------------------------- */}
          <div
            className="md:hidden mt-4 h-2.5 w-full rounded-full bg-neutral-200/80 overflow-hidden"
            role="presentation"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full transition-[left,width] duration-150 ease-out relative"
              style={{
                width: `${scrollProgress.thumbWidthPct}%`,
                marginLeft: `${scrollProgress.thumbLeftPct}%`,
                backgroundColor: GOLD,
                opacity: 0.75,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryStrip;