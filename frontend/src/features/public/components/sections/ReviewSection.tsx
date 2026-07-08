"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Review } from "@/src/data/reviewsData";

/**
 * ReviewsSection
 * ------------------------------------------------------------------
 * REBUILT — was previously a full-width auto-scrolling review
 * carousel ("What People Say"). New design pairs a brand "Our Story"
 * block with a compact customer-quotes column.
 * ------------------------------------------------------------------
 * Decisions / notes:
 * 1. Previous carousel implementation is preserved below in a
 *    commented block, per instruction — do NOT delete it, this
 *    section may be revisited. If we're confident the carousel is
 *    gone for good, remove the commented block in a follow-up
 *    cleanup PR rather than silently here.
 * 2. Layout: 2 columns on desktop (≈ 40/60 split — story left, quotes
 *    right), stacked on mobile.
 * 3. "Our Story" copy + product/hero image are hardcoded here for
 *    now — same rationale as the WhyChooseUs section: static brand
 *    copy, no CMS, no reuse. Promote to data file if this becomes
 *    editable.
 * 4. `reviews` prop is still consumed, but now sliced to the first 3
 *    (design shows 3 quote cards). Extra items in the array are
 *    ignored on purpose — no scroll, no pagination. If more need to
 *    be surfaced, that's what the "Read More Reviews" CTA is for.
 * 5. Product image is a placeholder URL (`/assets/our-story.jpg`) —
 *    swap for the real "Our Local Deli" tote/product shot when the
 *    asset lands. Alt text is meaningful (not "image").
 * 6. Uses the SAME LeafFlourish SVG as CategoryStrip / BestSeller /
 *    WhyChooseUs. This is now the 4th copy — extraction to
 *    `components/ui/LeafFlourish.tsx` is overdue. Flagging again,
 *    not fixing here to keep this diff focused.
 * 7. "Learn More About Us" and "Read More Reviews" link targets are
 *    placeholders (`/about`, `/reviews`) — confirm actual routes
 *    before ship.
 * ------------------------------------------------------------------
 */

// Shared palette — matches sibling sections. Consolidate into theme
// tokens when the design system is formalized.
const GOLD = "#C9A34E";
const DARK_GREEN = "#0d2818";
const CREAM_BG = "#e2d9c7";

/**
 * Leaf-branch flourish (4th copy across the codebase — extract soon).
 * Smaller variant used here since the section headers are smaller
 * than in CategoryStrip / BestSeller.
 */
const LeafFlourish = ({ mirrored = false }: { mirrored?: boolean }) => (
  <svg
    width="38"
    height="14"
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
 * Small 5-star row rendered as SVG polygons so we don't need to pull
 * in an icon-lib star that ships extra weight. Fixed at 5 stars —
 * this section's design shows every card as 5-star, so `rating` from
 * the review data is intentionally not read here. If mixed ratings
 * become a requirement, wire `review.rating` back into this loop.
 */
const FiveStars = ({ size = 14 }: { size?: number }) => (
  <div className="flex gap-0.5" style={{ color: "#F5B301" }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  // Design shows exactly 3 quote cards. Anything beyond that is
  // ignored on purpose — see decision #4 in the header comment.
  const displayedReviews = reviews.slice(0, 3);

  return (
    <section
      className="py-12 md:py-20 w-full overflow-hidden relative"
      style={{ backgroundColor: CREAM_BG }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-10 lg:gap-16 items-start">

          {/* ================================================
              LEFT COLUMN — Our Story
              Image + brand narrative + CTA. Image sits on top
              on mobile (natural DOM order), left column on desktop.
          ================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* Two-column mini-grid inside: text left, image right,
                so heading aligns with product photo top. On mobile
                stacks image-then-text for a more visual entry. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Text side */}
              <div className="flex flex-col gap-4 order-2 md:order-1">
                <div className="flex items-center gap-3">
                  <h2
                    className="font-serif text-lg md:text-xl tracking-[0.2em] uppercase"
                    style={{ color: DARK_GREEN }}
                  >
                    Our Story
                  </h2>
                  <LeafFlourish />
                </div>

                <div
                  className="text-sm leading-relaxed space-y-3"
                  style={{ color: `${DARK_GREEN}CC` }}
                >
                  <p>
                    Our Local Deli started from a simple mission—to make it
                    easier for busy families to enjoy delicious, high-quality
                    food at home.
                  </p>
                  <p>
                    We carefully curate every product and partner with local
                    producers who share our passion for good food and honest
                    ingredients.
                  </p>
                  <p>
                    Thank you for supporting local. Thank you for being part of
                    our deli family.
                  </p>
                </div>

                {/* CTA — outlined gold pill matching sibling buttons.
                    Placeholder route, confirm before ship. */}
                <Link
                  href="/about"
                  className="inline-flex items-center self-start mt-2
                             text-[11px] font-semibold uppercase tracking-[0.2em]
                             px-6 py-2.5 rounded border transition-colors"
                  style={{
                    color: GOLD,
                    borderColor: GOLD,
                  }}
                >
                  Learn More About Us
                </Link>
              </div>

              {/* Image side. Aspect-square keeps the frame stable
                  regardless of the asset's intrinsic ratio; object-cover
                  handles crop for non-square source images. */}
              <div
                className="relative aspect-square w-full rounded-lg overflow-hidden order-1 md:order-2"
                style={{ backgroundColor: `${DARK_GREEN}10` }}
              >
                <img
                  src="/assets/our-story.jpg"
                  alt="Our Local Deli tote bag and signature products"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback keeps layout stable if the asset 404s
                    // (which it will until the real image is uploaded).
                    (e.target as HTMLImageElement).src = "/assets/placeholder.png";
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* ================================================
              RIGHT COLUMN — What Our Customers Say
              3 stacked/wrapping quote cards + CTA below.
          ================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <h2
                className="font-serif text-lg md:text-xl tracking-[0.2em] uppercase"
                style={{ color: DARK_GREEN }}
              >
                What Our Customers Say
              </h2>
              <LeafFlourish />
            </div>

            {/* Cards. Grid-based: 1 col on mobile, 3 cols on md+.
                Kept as a grid (not a horizontal scroll) since the
                design shows all 3 visible at once — carousel behavior
                intentionally removed for this section. */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayedReviews.map((review, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 flex flex-col gap-3
                             shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
                >
                  <FiveStars />
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: DARK_GREEN }}
                  >
                    {review.review}
                  </p>
                  <p
                    className="text-xs font-medium mt-2"
                    style={{ color: `${DARK_GREEN}99` }}
                  >
                    – {review.name}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA under the cards, centered on mobile, left-aligned
                on desktop to sit under the card grid naturally. */}
            <div className="flex justify-center md:justify-start mt-2">
              <Link
                href="/reviews"
                className="inline-flex items-center
                           text-[11px] font-semibold uppercase tracking-[0.2em]
                           px-6 py-2.5 rounded border transition-colors"
                style={{
                  color: GOLD,
                  borderColor: GOLD,
                }}
              >
                Read More Reviews
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   PREVIOUS IMPLEMENTATION — "What People Say" auto-scrolling carousel.
   Preserved per instruction. Do not delete without confirmation.
   ------------------------------------------------------------------
   Original design: left-side heading + rating + "View All Reviews"
   button, right-side infinite horizontal Framer Motion marquee of
   review cards with a fade mask on both edges and hover-pause via
   local `isHovered` state.
   ==================================================================

"use client";
import { motion } from "framer-motion";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { Review } from "@/src/data/reviewsData";

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const [isHovered, setIsHovered] = useState(false);
  const DUPED_REVIEWS = [...reviews, ...reviews];

  return (
    <section className="py-12 md:py-24 bg-[#FDFDFD] w-full overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-24 flex flex-col xl:flex-row items-center xl:items-start gap-10 xl:gap-20">
        
        // Left Side: Title & Info
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex-shrink-0 w-full xl:w-[320px] flex flex-col items-center xl:items-start text-center xl:text-left pt-0 md:pt-4"
        >
          <h2 className="text-3xl md:text-5xl font-display text-secondary mb-4 md:mb-6 tracking-tight leading-tight">What People Say</h2>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm font-medium text-secondary">4.9/5 from 2,400+ reviews</span>
          </div>

          <button className="bg-gray-100 hover:bg-gray-200 text-secondary font-bold py-3 px-8 rounded-full transition-colors text-sm w-max tracking-wide">
            View All Reviews
          </button>
        </motion.div>

        // Right Side: Horizontal Carousel with Fade Mask
        <div 
          className="w-full relative overflow-hidden flex-1 py-4" 
          style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: reviews.length * 10,
                ease: "linear",
              },
            }}
            style={{ 
              display: "flex", 
              gap: "2rem", 
              width: "max-content", 
              animationPlayState: isHovered ? "paused" : "running",
              willChange: "transform"
            }}
            className="transition-all duration-300"
          >
            {DUPED_REVIEWS.map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="w-[320px] md:w-[380px] bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col flex-shrink-0"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={item.avatar} alt={item.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-secondary text-base">{item.name}</h4>
                    <p className="text-gray-500 text-xs">{item.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic font-serif leading-relaxed mb-6 text-sm flex-1">
                  {item.review}
                </p>
                <div className="flex text-yellow-400 mt-auto">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
================================================================== */