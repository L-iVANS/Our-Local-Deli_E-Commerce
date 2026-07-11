"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { HeroData } from "@/data/heroData";

const GOLD = "#C9A34E";
const DARK_GREEN = "#0d2818";
const CREAM = "#fef9df";

const HERO_IMAGE = "/assets/hero/hero-food.jpg";

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
    <path
      d="M2 9 C 14 9, 26 9, 44 9"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
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

const TrustItem = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-center gap-3">
    <div
      className="shrink-0 flex h-10 w-10 items-center justify-center"
      style={{ color: GOLD }}
    >
      {icon}
    </div>

    <div className="flex flex-col leading-tight">
      <span
        className="text-[11px] font-bold uppercase tracking-widest"
        style={{ color: CREAM }}
      >
        {title}
      </span>
      <span className="text-[10px]" style={{ color: `${CREAM}99` }}>
        {subtitle}
      </span>
    </div>
  </div>
);

export default function HeroB({ data }: { data: HeroData["versionB"] }) {
  const {
    headlinePart1,
    headlineItalic,
    heroDescriptionShort,
    ctaPrimary,
    ctaSecondary,
  } = data;

  return (
    <section
      className="relative isolate w-full overflow-hidden"
      style={{ backgroundColor: DARK_GREEN }}
    >
      {/* 
        FULL HERO BACKGROUND IMAGE
        This replaces the previous right-column image.
        The image now occupies the whole hero section.
      */}
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-30 h-full w-full object-cover object-[62%_center] md:object-center"
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.includes("/assets/placeholder.png")) {
            img.src = "/assets/placeholder.png";
          }
        }}
      />

      {/* Dark wash for premium green tone */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundColor: "rgba(6, 20, 12, 0.35)",
        }}
      />

      {/* Strong left gradient so text remains readable over the full image */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(90deg, rgba(5, 18, 10, 0.97) 0%, rgba(5, 18, 10, 0.92) 34%, rgba(5, 18, 10, 0.58) 58%, rgba(5, 18, 10, 0.18) 100%)",
        }}
      />

      {/* Subtle bottom depth like the reference */}
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-40"
        style={{
          background:
            "linear-gradient(0deg, rgba(5, 18, 10, 0.9) 0%, rgba(5, 18, 10, 0) 100%)",
        }}
      />

      {/* Thin gold border line at bottom of hero */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-px"
        style={{ backgroundColor: `${GOLD}66` }}
      />

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="flex min-h-[560px] items-center py-12 md:min-h-[620px] md:py-16 lg:min-h-[680px] lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex max-w-[650px] flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-3">
              <LeafFlourish />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em] md:text-xs"
                style={{ color: GOLD }}
              >
                Curated Filipino Favorites
              </span>
              <LeafFlourish mirrored />
            </div>

            {/* Main headline */}
            <h1
              className="mb-6 font-serif text-4xl font-black leading-[0.95] tracking-tight md:text-6xl lg:text-7xl xl:text-[88px]"
              style={{ color: CREAM }}
            >
              {headlinePart1}
              <br />
              <span style={{ color: CREAM }}>{headlineItalic}</span>
            </h1>

            {/* Description */}
            <p
              className="mb-8 max-w-md text-sm leading-relaxed md:text-base"
              style={{ color: `${CREAM}CC` }}
            >
              {heroDescriptionShort}
            </p>

            {/* CTA row */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-3 md:gap-4 lg:justify-start">
              <Link
                href="/catalog"
                className="rounded px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:opacity-90 active:scale-95 md:text-xs"
                style={{ backgroundColor: GOLD, color: DARK_GREEN }}
              >
                {ctaPrimary.text}
              </Link>

              <Link
                href="/#product-catalog"
                onClick={(e) => {
                  if (
                    typeof window !== "undefined" &&
                    window.location.pathname === "/"
                  ) {
                    e.preventDefault();
                    document
                      .getElementById("product-catalog")
                      ?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", "/#product-catalog");
                  }
                }}
                className="rounded border px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:opacity-90 active:scale-95 md:text-xs"
                style={{ color: GOLD, borderColor: GOLD }}
              >
                {ctaSecondary.text}
              </Link>
            </div>

            {/* Trust bar */}
            <div
              className="grid w-full max-w-2xl grid-cols-1 gap-4 border-t pt-5 sm:grid-cols-3 sm:gap-6"
              style={{ borderColor: `${GOLD}66` }}
            >
              <TrustItem
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="8"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M8 13l-2 8 6-3 6 3-2-8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                title="Premium Quality"
                subtitle="Carefully Selected"
              />

              <TrustItem
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21V9"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 9C9 4 5 4 3 6c2 4 6 5 9 3Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 13c3-5 7-5 9-3-2 4-6 5-9 3Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                title="Trusted Local Partners"
                subtitle="Supporting Filipino Makers"
              />

              <TrustItem
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 7h11v10H3z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 10h4l3 3v4h-7z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="7"
                      cy="18"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <circle
                      cx="17"
                      cy="18"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                }
                title="Delivered to Your Door"
                subtitle="Freshness Guaranteed"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}