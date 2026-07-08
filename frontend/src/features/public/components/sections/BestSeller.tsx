"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  ShieldCheck,
  Clock,
  ChefHat,
  Loader2,
} from "lucide-react";

import { useHorizontalScroller } from "./hooks/useHorizontalScroller";
import { useAddCartItem } from "@/features/public/cart/hooks/useAddCartItem";
import type { BestSeller as BestSellerProduct } from "@/data/bestSellers";
import { bestSellersData } from "@/data/bestSellers";

const GOLD = "#C9A34E";
const BG_DARK = "#0d2818";
const TEXT_CREAM = "#fef9df";

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

const BADGE_ICON_MAP: Record<BestSellerProduct["badges"][number]["type"], React.ReactNode> = {
  leaf: <Leaf size={12} />,
  shield: <ShieldCheck size={12} />,
  clock: <Clock size={12} />,
  chef: <ChefHat size={12} />,
};

const BestSeller = () => {
  const { scrollRef, canScrollPrev, canScrollNext, scrollProgress, scrollPrev, scrollNext } = useHorizontalScroller();

  return (
    <section className="relative w-full bg-[#0d2818] py-10 md:py-16">
      <div className="w-full max-w-full px-4 md:container md:mx-auto md:px-6">
        
        {/* Header Section */}
        <div className="relative flex items-center justify-center mb-10 md:mb-16">
          <div className="flex items-center gap-4 md:gap-6">
            <LeafFlourish />
            <h2 className="font-serif text-2xl md:text-4xl tracking-[0.2em] text-[#fef9df] uppercase">
              Best Sellers
            </h2>
            <LeafFlourish mirrored />
          </div>

          <Link
            href="/catalog"
            className="hidden md:flex absolute right-0 items-center border border-[#C9A34E] 
                       text-[#C9A34E] text-[12px] font-bold uppercase tracking-[0.2em] 
                       px-6 py-2 rounded hover:bg-[#C9A34E] hover:text-[#0d2818] transition-all"
          >
            View All Products
          </Link>
        </div>

        <div className="relative">
          {/* Scroll Buttons */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="hidden md:flex absolute -left-5 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#fef9df] text-[#0d2818] items-center justify-center hover:scale-105 transition-transform disabled:opacity-30"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="hidden md:flex absolute -right-5 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#fef9df] text-[#0d2818] items-center justify-center hover:scale-105 transition-transform disabled:opacity-30"
          >
            <ChevronRight size={24} />
          </button>

          {/* Cards Row */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4
                       [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {bestSellersData.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: BestSellerProduct }) => {
  const { mutate: addToCart, isPending } = useAddCartItem();

  return (
    <div className="flex flex-col shrink-0 snap-start w-[180px] md:w-[220px] bg-[#0d2818] border border-[#C9A34E]/50 rounded-sm overflow-hidden group">
      {/* -----------------------------------------------------------
          Image Area
          Fixed pixel height (not aspect-ratio) so every card has an
          identical image window regardless of:
          - card width variations from scroll-snap
          - whether the source image actually loaded
          - source image's intrinsic aspect ratio
          overflow-hidden + object-cover handles the crop cleanly.

          onError swaps to a placeholder so broken URLs show SOMETHING
          instead of an empty green void — this is what was happening
          to the 4 middle cards in the previous screenshot.
      ----------------------------------------------------------- */}
      <div
        className="w-full bg-[#153a26] overflow-hidden shrink-0"
        style={{ height: "220px" }}
      >
        <img
          src={product.image || "/assets/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover block"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/assets/placeholder.png";
          }}
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <h4 className="font-serif text-[#fef9df] text-sm leading-tight h-[2.5em] line-clamp-2">
          {product.name}
        </h4>

        {/* Badges */}
        <div className="flex flex-col gap-1">
          {product.badges.map((badge, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[10px] text-[#fef9df]/70">
              <span className="text-[#C9A34E]">{BADGE_ICON_MAP[badge.type]}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between text-[#fef9df]">
          <span className="text-[11px] opacity-70">{product.weight}</span>
          <span className="font-bold text-lg">₱{product.price}</span>
        </div>

        <button
          type="button"
          onClick={() => addToCart({ productId: product.productId, quantity: 1 })}
          disabled={isPending}
          className="mt-2 w-full border border-[#C9A34E] text-[#C9A34E] 
                     text-[11px] font-bold uppercase tracking-widest py-2
                     hover:bg-[#C9A34E] hover:text-[#0d2818] transition-colors"
        >
          {isPending ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default BestSeller;