"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wine, ChefHat, Soup, Thermometer, ChevronLeft, ChevronRight } from "lucide-react";

import { CategoryData } from "@/src/data/categoriesData";

// Add a helper mapping for icons
const IconMap: Record<string, React.ReactNode> = {
  "Wine": <Wine size={20} />,
  "ChefHat": <ChefHat size={20} />,
  "Soup": <Soup size={20} />,
  "Thermometer": <Thermometer size={20} />
};

const CategoryStrip = ({ categories }: { categories: CategoryData[] }) => {
  return (
    <section className="relative z-[80] -mt-24 md:-mt-32 lg:-mt-60 mb-0 pointer-events-none overflow-hidden">
      <div className="w-full max-w-full px-0 md:container md:mx-auto md:px-6 pointer-events-auto">
        {/* Main Floating Container */}
        <div className="relative bg-[#F9F3EE] rounded-none md:rounded-[3.5rem] p-4 md:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-y md:border border-white/50">

          {/* Navigation Controls (Left/Right Buttons) - Hidden on Mobile */}
          <div className="absolute inset-y-0 -left-4 md:-left-8 hidden md:flex items-center z-10">
            <button className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white shadow-xl border border-neutral-100 flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all active:scale-95">
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute inset-y-0 -right-4 md:-right-8 hidden md:flex items-center z-10">
            <button className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white shadow-xl border border-neutral-100 flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all active:scale-95">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Grid Content: 2 columns on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {categories.map((category, i) => (
              <motion.a
                key={category.id}
                href={`#${category.id}`}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.96 }}
                className="group relative aspect-[3/4] rounded-xl md:rounded-[2.5rem] overflow-hidden shadow-md"
              >
                {/* Background Media */}
                {category.videoUrl ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  >
                    <source src={category.videoUrl.replace('.mp4', '.webm')} type="video/webm" />
                    <source src={category.videoUrl} type="video/mp4" />
                  </video>

                ) : (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}


                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors" />

                {/* Vertical Pill Label - Ultra Compact for Mobile Visibility */}
                <div className="absolute bottom-1.5 md:bottom-4 left-1 md:left-4 right-1 md:right-4 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-0.5 md:gap-1.5 bg-white/20 backdrop-blur-md px-0.5 md:px-4 py-1 md:py-2 rounded-full border border-white/30 transform transition-transform group-hover:scale-105 w-full justify-center overflow-hidden">
                    <div className="w-5 md:w-6 lg:w-8 h-5 md:h-6 lg:h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                      {/* Scale icon based on container */}
                      <div className="scale-[0.7] md:scale-40 lg:scale-100 flex items-center justify-center">
                        {IconMap[category.iconName] || <ChefHat size={20} />}
                      </div>
                    </div>
                    <span className="text-white font-bold text-[8px] xs:text-[10px] md:text-[10px] tracking-tighter md:tracking-widest uppercase whitespace-nowrap leading-none shrink-0">
                      {category.name}
                    </span>
                  </div>
                </div>

                {/* Glow/Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.a>
            ))}
          </div>

        </div>

      </div>
    </section>

  );
};

export default CategoryStrip;