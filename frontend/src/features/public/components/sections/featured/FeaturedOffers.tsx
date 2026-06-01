"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Play } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { featuredOffersData, FeaturedOfferCardData } from "@/src/data/featuredOffersData";
import { Button } from "../../../../../components/ui/Button";

const FeaturedOffers = () => {
  return (
    <section className="bg-white py-12 md:py-24 border-b border-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-black text-accent text-center tracking-tight uppercase">
            Featured Offers
          </h2>
          <div className="w-16 h-0.75 bg-accent rounded-full" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-10">
          {featuredOffersData.map((offer, i) => (
            <OfferCard key={offer.id} offer={offer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const OfferCard = ({ offer, index }: { offer: FeaturedOfferCardData; index: number }) => {
  const { socialMedia, promo, product } = offer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.08)] border border-neutral-100 flex flex-row transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] hover:-translate-y-2 h-full"
    >
      {/* Left Part: Social Media Block (60% width on Desktop) */}
      <div className="relative w-full sm:w-[70%] md:w-[60%] aspect-[4/5] md:aspect-auto overflow-hidden">
        {socialMedia.mediaType === "video" ? (
          <div className="relative w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            >
              <source src={socialMedia.mediaUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all duration-500">
                <Play size={20} fill="currentColor" />
              </div>
            </div>
          </div>
        ) : (
          <img
            src={socialMedia.mediaUrl}
            alt={socialMedia.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Top Discount Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-accent text-white font-black text-xs md:text-sm px-4 py-2 rounded-full shadow-lg transform -rotate-2 group-hover:rotate-0 transition-transform">
            {promo.discountLabel}
          </div>
        </div>

        {/* Overlay Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-white font-bold text-lg md:text-xl leading-tight mb-2 drop-shadow-md">
            {socialMedia.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {socialMedia.hashtags.map((tag) => (
              <span key={tag} className="text-white/70 text-[10px] md:text-xs font-medium uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Part: Product Block (40% width on Desktop) */}
      <div className="w-full sm:w-[30%] md:w-[40%] bg-white p-6 md:py-10 md:px-6 flex flex-col justify-between items-center text-center">
        <div className="w-full space-y-4">
          <div className="relative aspect-square w-full max-w-[140px] mx-auto bg-neutral-50 rounded-2xl overflow-hidden p-4 group-hover:bg-neutral-100 transition-colors duration-500">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/placeholder.png";
              }}
            />
          </div>
          <div className="space-y-1 px-1">
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Recommended</p>
            <h4 className="text-secondary font-bold text-sm leading-tight line-clamp-2">
              {product.name}
            </h4>
          </div>
        </div>

        <Link
          href={product.link || "/catalog"}
          className="w-full mt-6 group/btn"
        >
          <Button
            className="w-full bg-primary hover:opacity-90 text-white rounded-xl py-4 h-auto text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>View Product</span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default FeaturedOffers;
