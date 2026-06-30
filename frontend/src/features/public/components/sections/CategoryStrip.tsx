"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHorizontalScroller } from "./hooks/useHorizontalScroller";
import { CategoryData } from "@/src/data/categoriesData";

/**
 * CategoryStrip
 * ------------------------------------------------------------------
 * LO-FI / PLACEHOLDER PASS
 * ------------------------------------------------------------------
 * This is intentionally a structural/skeleton build, not the final
 * polished version. Purpose: lock down layout + behavior so design
 * + data wiring can proceed in parallel without blocking each other.
 *
 * Decisions confirmed with stakeholder before this build:
 * 1. Single row, horizontal scroll (native scroll-snap, no JS
 *    carousel lib) — kicks in past 5 items on desktop, ~3 on mobile.
 * 2. No floating card wrapper — flat background, normal doc flow.
 * 3. Circular avatars, label BELOW the circle (not overlaid).
 * 4. No icon badge rendered (iconName stays in the data type for
 *    forward-compat / CMS reasons, just unused in this UI for now).
 * 5. Video support (category.videoUrl) intentionally dropped from
 *    rendering. Field stays optional in the type — not our call to
 *    delete from the data contract.
 * 6. Heading ("Shop By Category" + flourishes) now lives INSIDE
 *    this component (previously lived elsewhere / didn't exist here).
 * 7. Prev/Next chevrons are now functional (scrollBy), not decorative.
 * 8. Mobile (<md:) has NO chevrons — touch + chevron buttons fight
 *    each other (thumb taps button instead of swiping, button can
 *    overlap content on narrow screens). Instead, mobile shows a
 *    thicker rounded scroll-progress bar under the row, driven by a
 *    scroll event listener (scrollLeft / scrollWidth / clientWidth).
 *    This swaps to chevrons at exactly the `md:` breakpoint, matching
 *    where chevrons already appear.
 * 9. Desktop chevrons are disabled (real `disabled` attribute, not
 *    just visually faded) when at the start/end of the row — standard
 *    pagination-button UX. Edge state is derived from the same scroll
 *    measurement that drives the mobile progress bar, so there's one
 *    source of truth, not two separate calculations to keep in sync.
 * ------------------------------------------------------------------
 */

const CategoryStrip = ({ categories }: { categories: CategoryData[] }) => {
  const {
    scrollRef,
    canScrollPrev,
    canScrollNext,
    scrollProgress,
    scrollPrev,
    scrollNext,
  } = useHorizontalScroller();
  // Tracks how far through the row the user has scrolled, as a
  // percentage (0–100). Drives the mobile progress bar's thumb
  // width/position. Desktop ignores this entirely (uses chevrons).

  // Edge state for desktop chevrons. Reused from the same scroll
  // measurement as the mobile progress bar — no separate calc needed.
  // A small epsilon avoids float-rounding flakiness keeping a button
  // enabled/disabled by a sub-pixel margin.

  // If content doesn't overflow, thumb fills the whole track,
  // there's nothing to scroll, and both chevrons stay disabled.

  // Scroll by roughly one "page" of visible items.

  return (
    <section className="relative w-full bg-[#F9F3EE] py-10 md:py-16">
      <div className="w-full max-w-full px-4 md:container md:mx-auto md:px-6">
        {/* ---------------------------------------------------------
            Heading
            NOTE: flourish icons below are placeholder text glyphs
            ("⚜") standing in for the actual decorative SVG/icon
            asset used in the final design. Swap once asset is
            provided — do not ship this glyph to production.
        --------------------------------------------------------- */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-8 md:mb-10">
          <span
            className="text-primary/60 text-lg md:text-xl select-none"
            aria-hidden="true"
          >
            ⚜
          </span>
          <h2 className="font-serif text-xl md:text-3xl tracking-wide text-secondary uppercase">
            Shop By Category
          </h2>
          <span
            className="text-primary/60 text-lg md:text-xl select-none scale-x-[-1]"
            aria-hidden="true"
          >
            ⚜
          </span>
        </div>

        {/* ---------------------------------------------------------
            Row wrapper: relative, so chevrons can be absolutely
            positioned over it without affecting scroll content.
        --------------------------------------------------------- */}
        <div className="relative">
          {/* Prev button — hidden on mobile per native swipe UX,
              shown on desktop where pointer/trackpad is primary input.
              Disabled (not just visually faded, but a real `disabled`
              attribute) when already at the start of the row — this
              gets correct screen-reader announcement and removes it
              from the tab order's "actionable" state for free, rather
              than us having to fake that with aria-disabled + onClick
              guards. */}
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
              Scrollable row.
              - flex + overflow-x-auto + scroll-snap for native,
                accessible horizontal scrolling (touch + trackpad work
                out of the box, no JS carousel library needed).
              - scrollbar hidden via inline style + className guard
                (Tailwind has no built-in scrollbar-hide utility
                without a plugin, so this is done manually below).
          --------------------------------------------------------- */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory
                       [-ms-overflow-style:none] [scrollbar-width:none]
                       [&::-webkit-scrollbar]:hidden
                       pb-2"
          >
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="group flex flex-col items-center gap-3 shrink-0 snap-start
                           w-[28vw] max-w-[120px] md:w-[150px] md:max-w-none"
              >
                {/* ---------------------------------------------
                    PLACEHOLDER NOTE:
                    Circle currently renders the real <img> from
                    categoriesData since image URLs already exist
                    in the data file. If/when a true "no image yet"
                    placeholder is needed (e.g. new category added
                    without an image), fall back to the gray
                    skeleton block shown commented below.
                --------------------------------------------------- */}
                <div
                  className="relative aspect-square w-full rounded-full overflow-hidden
                             border-2 border-primary/40 shadow-sm bg-neutral-200"
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover
                                 transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    // Fallback skeleton block — used only when no image exists yet.
                    <div className="absolute inset-0 animate-pulse bg-neutral-300" />
                  )}
                </div>

                <span
                  className="font-serif text-[11px] md:text-sm text-center leading-tight
                             tracking-wide text-secondary uppercase"
                >
                  {category.name}
                </span>
              </a>
            ))}
          </div>

          {/* ---------------------------------------------------------
              Mobile-only scroll progress bar.
              Visible below `md:` only — swaps with chevrons exactly
              at the same breakpoint chevrons use, so there's never
              a moment with both or neither visible.

              Track height bumped to h-2.5 (10px) — at h-1 (4px) the
              rounded-full corners were too subtle to read as "rounded"
              rather than just a flat line. 10px is enough for the
              pill shape to be visually obvious at typical mobile DPI.

              Implementation note: this is a continuous bar (moving
              "thumb" over a track), not discrete dots. Dots imply
              fixed pages, which doesn't map cleanly to free-scroll
              + scroll-snap with a variable item count. A continuous
              bar accurately reflects partial-scroll positions.
          --------------------------------------------------------- */}
          <div
            className="md:hidden mt-4 h-2.5 w-full rounded-full bg-neutral-200/80 overflow-hidden"
            role="presentation"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-primary/70 transition-[left,width] duration-150 ease-out relative"
              style={{
                width: `${scrollProgress.thumbWidthPct}%`,
                marginLeft: `${scrollProgress.thumbLeftPct}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryStrip;
