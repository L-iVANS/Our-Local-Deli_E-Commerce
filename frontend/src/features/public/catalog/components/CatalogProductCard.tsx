"use client";

import React from "react";
import { Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/lib/utils";

interface Product {
  productId: number | string;
  productName: string;
  category: string;
  productPrice: number;
  imageUrl?: string;
  // Mocked fields for demo
  rating?: number;
  reviewCount?: number;
  badge?: "Best Seller" | "New" | "Bundle";
}

interface CatalogProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const CatalogProductCard: React.FC<CatalogProductCardProps> = ({
  product,
  onClick,
}) => {
  // Deterministic mock data for demo based on productId to avoid hydration mismatch
  const idValue =
    typeof (product as any).id === "number"
      ? (product as any).id
      : Number((product as any).id) || 0;
  const rating = product.rating || 4.5 + (idValue % 5) * 0.1;
  const reviews = product.reviewCount || ((idValue * 123) % 400) + 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer flex flex-col h-full border border-neutral-100 rounded-4xl p-4 md:p-6 transition-all duration-300"
      onClick={() => onClick(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-4/5 md:aspect-square mb-4 md:mb-6 bg-[#F8F8F8] rounded-3xl overflow-hidden flex items-center justify-center transition-all duration-700 group-hover:bg-[#F2F2F2]">
        {product.badge && (
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <span
              className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white",
                product.badge === "Best Seller"
                  ? "bg-primary"
                  : product.badge === "New"
                    ? "bg-blue-600"
                    : "bg-secondary",
              )}
            >
              {product.badge}
            </span>
          </div>
        )}

        <img
          src={product.imageUrl || "/assets/placeholder.png"}
          alt={product.productName}
          className="w-full h-full object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/assets/placeholder.png";
          }}
        />
      </div>

      {/* Details */}
      <div className="flex flex-col grow">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">
          {product.category
            ? product.category
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())
            : "Houseware"}
        </span>

        <h3 className="text-lg md:text-xl font-bold text-secondary font-display mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-[1.2]">
          {product.productName}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-6">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                className={i < Math.floor(rating) ? "" : "text-neutral-200"}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-neutral-400">
            ({reviews})
          </span>
        </div>

        {/* Price and Action */}
        <div className="mt-auto flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
          <p className="text-lg md:text-2xl font-black text-secondary">
            ₱{new Intl.NumberFormat().format(product.productPrice)}
          </p>

          <Button className="rounded-2xl h-10 md:h-12 px-4 md:px-6 bg-[#ffffff] text-primary hover:bg-primary hover:text-white shadow-none border border-1 border-primary normal-case tracking-normal font-bold text-sm md:text-base flex items-center justify-center gap-2 group/btn transition-all duration-300">
            <ArrowRight
              size={16}
              className="md:size-4.5 transition-transform group-hover/btn:translate-x-1"
            />
            <span>Order</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CatalogProductCard;
