"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowRight } from "lucide-react";

import { HeroData } from "@/src/data/heroData";


const GroupTray = ({ group, direction, isMobile }: { group: any, direction: number, isMobile: boolean }) => {
  return (
    <motion.div
      key={group.id}
      custom={direction}
      initial={{
        x: 1800,
        z: -800,
        y: -100,
        scale: 0.6,
        rotateY: 0,
        opacity: 1
      }}
      animate={{
        x: [1800, 1600, 1300, 900, 600, 350, 150, 50, 20, 0],
        z: [-800, -780, -730, -650, -500, -300, -100, 50, 150, 250],
        y: [-100, -90, -75, -50, -20, 10, 40, 70, 90, 100],
        scale: [0.6, 0.65, 0.7, 0.8, 0.9, 0.95, 0.98, 0.99, 1, 1],
        rotateY: 0,
        opacity: 1
      }}
      exit={{
        x: [0, 50, 150, 400, 750, 1200, 1800, 2500, 3500, 4500],
        z: [250, 300, 400, 600, 900, 1300, 1800, 2400, 3100, 3900],
        y: [100, 120, 160, 230, 330, 480, 680, 930, 1230, 1580],
        scale: [1, 1.1, 1.2, 1.4, 1.6, 2, 2.5, 3.2, 4, 5],
        rotateY: 0,
        opacity: 1
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut" as any,
        times: [0, 0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88, 1]
      }}
      className="absolute inset-x-0 bottom-[55%] md:inset-0 flex items-center justify-center gap-4 md:gap-8 lg:gap-12"
      style={{ transformStyle: "preserve-3d" }}
    >
      {group.products.map((product: any, idx: number) => {
        const isMain = idx === 1;
        const { scale = 1.25, translateY = 0, translateX = 0 } = product.heroSettings || {};

        // Mobile Layout Normalization (Bowling Pin formation - Balanced)
        const mobileYOffset = idx === 1 ? 90 : -130;
        const mobileXOffset = idx === 0 ? -120 : idx === 2 ? 120 : 0;
        
        return (
          <motion.a
            key={product.id}
            href={`/shop/${product.id}`}
            whileHover={isMobile ? {} : {
              y: -25,
              scale: (isMain ? 1.15 : 0.9) * 1.05,
              filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.25))"
            }}
            className={isMobile ? "absolute" : "relative group cursor-pointer block"}
            style={isMobile ? {
              left: `calc(50% + ${mobileXOffset}px)`,
              top: `calc(50% + ${mobileYOffset}px)`,
              transform: 'translate(-50%, -50%)',
              zIndex: isMain ? 20 : 10
            } : {}}
          >
            <motion.div
              animate={{
                // Synchronize label + image movement on mobile by moving the container
                y: isMobile 
                  ? (translateY * 0.2) // mobile-normalized CMS translation
                  : (isMain ? 20 : -10),
                x: isMobile ? (translateX * 0.2) : 0,
                scale: isMain ? 1.15 : 0.9,
                z: isMain ? 250 : 0
              }}
              className="relative flex flex-col items-center"
            >
              <motion.img
                src={product.image}
                alt={product.name}
                animate={{
                  // Proportional scale for mobile impact
                  scale: isMobile ? Math.min(Math.max(scale * 1.3, 1.3), 2.0) : scale,
                  // Desktop only translation (Mobile handled by container)
                  y: isMobile ? 0 : translateY,
                  x: isMobile ? 0 : translateX
                }}
                style={{ transformOrigin: "bottom center" }}
                className="w-52 sm:w-56 md:w-72 lg:w-[400px] h-auto drop-shadow-2xl"
              />
              <div className={`w-full h-8 bg-black/10 blur-3xl rounded-full absolute -bottom-4 left-0 -z-10 scale-x-125 transition-opacity ${isMain ? 'opacity-40' : 'opacity-20'}`} />

              <div className={`absolute -right-4 -bottom-4 md:-right-6 md:-bottom-6 z-[60] bg-white/98 backdrop-blur-md p-3 md:p-5 rounded-2xl md:rounded-[2rem] shadow-2xl flex flex-col gap-1 w-32 md:w-48 border border-white/50 transition-all duration-500 ${isMain ? 'ring-1 ring-primary/20 scale-100' : 'scale-90 opacity-85'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary">In Stock</span>
                  <ShoppingCart size={12} className="text-neutral-300 md:block hidden" />
                </div>
                <span className="text-xs md:text-sm font-bold text-secondary leading-tight line-clamp-1">{product.name}</span>
                <div className="flex items-center justify-between">
                  <span className="text-lg md:text-xl font-black text-secondary">{product.price}</span>
                  {isMain && <ArrowRight size={16} className="text-primary md:block hidden" />}
                </div>
              </div>
            </motion.div>
          </motion.a>
        );
      })}
    </motion.div>
  );
};

const Hero = ({ data }: { data: HeroData["versionA"] }) => {
  const { productGroups, headlinePart1, headlineItalic, heroDescriptionShort, bgImage, ctaPrimary, ctaSecondary } = data;
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse Tracking for dynamic background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid movement
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Map mouse values to subtle pixel translates (parallaxes)
  const x = useTransform(springX, [-0.5, 0.5], ["-2%", "2%"]);
  const y = useTransform(springY, [-0.5, 0.5], ["-2%", "2%"]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-2, 2]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();

    // Normalize position from -0.5 to 0.5
    const xPos = (clientX - left) / width - 0.5;
    const yPos = (clientY - top) / height - 0.5;

    mouseX.set(xPos);
    mouseY.set(yPos);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => {
    setDirection(1);
    setCurrentGroupIndex((prev) => (prev + 1) % productGroups.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentGroupIndex((prev) => (prev - 1 + productGroups.length) % productGroups.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[700px] md:min-h-[1100px] lg:h-[95vh] lg:min-h-[900px] w-full overflow-hidden flex flex-col justify-end bg-[#FDFDFD] pt-[clamp(80px,15vh,140px)] pb-[clamp(30px,4vh,220px)]"
    >
      <div className="absolute inset-0 z-0 select-none overflow-hidden pointer-events-none">
        {/* Main Background Layer with Mouse Follow */}
        <motion.div
          className="w-full h-full relative pointer-events-none"
          style={{
            x,
            y,
            rotateX,
            rotateY,
            scale: 1.15, // Slightly zoomed in to allow panning without showing edges
            perspective: 1000
          }}
        >
          <img
            src={bgImage}
            className="w-full h-full object-cover object-bottom transform scale-100 opacity-90"
            alt="Omega Kitchen Environment"
          />
        </motion.div>

        {/* Table Image Layer - Remains Fixed for Grounding */}
        <div className="absolute bottom-0 left-0 w-full h-[1200px] md:h-[1300px] lg:h-[1350px] z-[70] flex items-end pointer-events-none">
          <img
            src="/assets/modernkitchen_bg_hero_table.png"
            className="w-full h-full object-cover object-bottom"
            alt="Kitchen Table"
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-b lg:bg-linear-to-r from-white/95 via-white/80 lg:via-white/50 to-white/40 lg:to-transparent z-20 pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 w-full mt-auto mb-0 lg:mb-10 xl:mb-20">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-12 items-center w-full">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:col-span-5 pb-0 lg:pb-12 relative z-20 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-[100px] font-display font-black text-secondary leading-[0.95] mb-6 md:mb-8 tracking-tighter">
              {headlinePart1} <br />
              <span className="text-primary italic">{headlineItalic}</span>
            </h1>

            <p className="text-neutral-500 text-sm md:text-lg lg:text-xl font-medium leading-relaxed mb-8 md:mb-12 max-w-sm">
              {heroDescriptionShort}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-5">
              <Link href="/catalog" className="bg-secondary hover:bg-black text-white px-6 md:px-10 py-4 md:py-6 h-auto rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest transition-all duration-300 shadow-2xl shadow-black/30 hover:scale-105 active:scale-95 flex items-center gap-3">
                {ctaPrimary.text}
                <ArrowRight size={18} />
              </Link>

              <Link 
                href="#product-catalog" 
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    document.getElementById("product-catalog")?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", "#product-catalog");
                  }
                }}
                className="bg-white hover:bg-neutral-50 text-secondary border border-neutral-200 px-6 md:px-10 py-4 md:py-6 h-auto rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
              >
                {ctaSecondary.text}
              </Link>
            </div>
          </motion.div>

          {/* Right Side: High-Speed Orbit Carousel */}
          <div className="w-full lg:col-span-7 relative h-[350px] sm:h-[500px] md:h-[600px] lg:h-[700px] perspective-[3000px] flex items-end md:items-center justify-center mt-6 lg:mt-0 mb-20 md:mb-0 -mx-4 w-[calc(100%+2rem)]">
            {/* Absolute Controls */}
            <div className="absolute inset-x-0 lg:-inset-x-8 top-1/2 -translate-y-1/2 flex items-center justify-between z-50 pointer-events-none">
              <button
                onClick={prev}
                className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-90 pointer-events-auto"
              >
                <ChevronLeft size={20} className="md:w-7 md:h-7" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-90 pointer-events-auto"
              >
                <ChevronRight size={20} className="md:w-7 md:h-7" />
              </button>
            </div>

            <div className="relative w-[130%] sm:w-[150%] h-full flex items-center justify-center scale-90 sm:scale-90 lg:scale-100" style={{ transformStyle: "preserve-3d" }}>
              <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                <GroupTray
                  key={currentGroupIndex}
                  group={productGroups[currentGroupIndex]}
                  direction={direction}
                  isMobile={isMobile}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-red-100/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
    </section>
  );
};

export default Hero;