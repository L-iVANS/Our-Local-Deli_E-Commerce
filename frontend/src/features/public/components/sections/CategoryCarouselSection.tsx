"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Play, ShoppingBag } from "lucide-react";
import { cn } from "@/src/lib/utils";

import { AffiliateSocialPost } from "@/src/data/socialsData";

interface CategoryCarouselProps {
  id: string;
  title: string;
  subtitle: string;
  items: AffiliateSocialPost[];
  themeColor?: string;
  bgColor?: string;
  floatingImageScale?: number;
}

// Map category IDs to their asset folders for floating visuals
const CATEGORY_ASSET_MAP: Record<string, string> = {
  glassware: "glassware",
  kitchenware: "cookware",
  dinnerware: "dinnerware",
  "vacuum-flask": "vacuum-flask",
};

const CategoryCarouselSection: React.FC<CategoryCarouselProps> = ({
  id,
  title,
  subtitle,
  items,
  themeColor = "bg-primary",
  bgColor = "bg-white",
  floatingImageScale = 1
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showFloatingImage, setShowFloatingImage] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const folderName = CATEGORY_ASSET_MAP[id] || id;
  const fileName = folderName.replace(/-/g, "");
  const floatingImageUrl = `/assets/product_category/${folderName}/${fileName}1.png`;

  return (
    <section id={id} className={cn("py-16 md:py-28 overflow-hidden relative", bgColor)}>

      {/* 1. Background Container Block */}
      <div className="w-full max-w-full px-0 md:container md:mx-auto md:px-8 relative z-10">
        <div className="bg-neutral-50/50 rounded-none md:rounded-[3rem] p-6 md:p-8 lg:p-12 relative overflow-visible border-y md:border border-neutral-100/50 shadow-sm">

          {/* 3. Category Product Visual (Floating BEHIND cards but ABOVE background) */}
          <div className="absolute top-[-10rem] left-[65%] w-[35%] h-[20rem] pointer-events-none z-10 hidden md:block overflow-visible">
            <AnimatePresence mode="wait">
              <motion.img
                key={floatingImageUrl}
                src={floatingImageUrl}
                alt=""
                initial={{ opacity: 0, x: 50, y: 40, rotate: 15 }}
                whileInView={{ opacity: 0.8, x: 0, y: 0, rotate: -8 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ scale: floatingImageScale }}
                className="absolute top-0 left-0 w-full max-w-[450px] h-auto object-contain drop-shadow-[0_45px_60px_rgba(0,0,0,0.35)] origin-center"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Fallback to AVIF if PNG fails (some assets might be AVIF)
                  if (target.src.endsWith('.png')) {
                    target.src = target.src.replace('.png', '.avif');
                  } else {
                    target.style.display = 'none';
                  }
                }}
              />
            </AnimatePresence>
          </div>

          <div className="relative z-20">
            {/* Header */}
            <div className="flex flex-col mb-10 md:mb-16 max-w-2xl">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-primary leading-tight mb-4 tracking-tight">
                {title}
              </h2>
              <p className="text-neutral-500 text-sm md:text-base font-medium leading-relaxed opacity-80">
                {subtitle}
              </p>
            </div>

            {/* 2. Carousel Container with Internal Navigation */}
            <div className="relative group/carousel">

              {/* Internal Navigation Buttons */}
              <div className="absolute inset-y-0 left-0 -translate-x-4 md:-translate-x-8 flex items-center z-30">
                <button
                  onClick={() => scroll("left")}
                  className="w-12 h-16 md:w-14 md:h-20 bg-secondary/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-primary transition-all shadow-xl active:scale-95 group-hover/carousel:translate-x-2 opacity-0 group-hover/carousel:opacity-100 duration-300"
                >
                  <ChevronLeft size={28} strokeWidth={2.5} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 translate-x-4 md:translate-x-8 flex items-center z-30">
                <button
                  onClick={() => scroll("right")}
                  className="w-12 h-16 md:w-14 md:h-20 bg-secondary/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-primary transition-all shadow-xl active:scale-95 group-hover/carousel:-translate-x-2 opacity-0 group-hover/carousel:opacity-100 duration-300"
                >
                  <ChevronRight size={28} strokeWidth={2.5} />
                </button>
              </div>

              {/* Carousel Content */}
              <div
                ref={scrollRef}
                className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none no-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="shrink-0 w-[280px] md:w-[320px] lg:w-[380px] snap-start"
                  >
                    {/* Media Card */}
                    <div className="relative aspect-[9/16] bg-neutral-900 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-3 group">
                      {/* Background Image / Video Cover */}
                      {item.videoUrl ? (
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        >
                          <source src={item.videoUrl.replace('.mp4', '.webm')} type="video/webm" />
                          <source src={item.videoUrl} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={item.productImage}
                          alt={item.influencer}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/placeholder.png";
                          }}
                        />
                      )}

                      {/* Visual Overlays */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-black/20 flex flex-col justify-end p-6">

                        {/* Side Engagement Bars */}
                        <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 text-white text-xs font-bold">
                          <div className="flex flex-col items-center gap-1 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-primary transition-colors">
                              <Heart size={20} />
                            </div>
                            <span className="drop-shadow-md">{item.likes}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-primary transition-colors">
                              <MessageCircle size={20} />
                            </div>
                            <span className="drop-shadow-md">{item.comments}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-primary transition-colors">
                              <Share2 size={20} />
                            </div>
                            <span className="drop-shadow-md">{item.shares || "2.1k"}</span>
                          </div>
                        </div>

                        {/* Middle Play UI */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                            <Play size={28} fill="currentColor" />
                          </div>
                        </div>

                        {/* Bottom Info & CTA */}
                        <div className="space-y-4">
                          {/* Influencer Tag */}
                          <div className="flex items-center gap-3 w-max">
                            <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden bg-neutral-800 shrink-0 shadow-lg">
                              <img
                                src={item.avatar}
                                alt={item.influencer}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm font-bold text-white drop-shadow-md">{item.influencer}</span>
                          </div>

                          {/* Caption */}
                          <p className="text-xs text-white/90 leading-relaxed font-medium drop-shadow-sm line-clamp-2 italic">
                            {item.caption}
                          </p>

                          {/* Product Details & Buy Now Button */}
                          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white font-bold text-xs uppercase tracking-tight">{item.productName}</span>
                              <span className="text-primary font-black text-sm">{item.offerPrice || item.regularPrice}</span>
                            </div>

                            <a
                              href={item.affiliateLink}
                              className="w-full bg-white hover:bg-primary hover:text-white text-secondary rounded-xl py-3 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all duration-300 shadow-xl"
                            >
                              <ShoppingBag size={14} />
                              Shop Now
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarouselSection;