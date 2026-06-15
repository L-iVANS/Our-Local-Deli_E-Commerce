"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/Button";

interface Product {
  productId: number | string;
  productName: string;
  category: {
    categoryName: string;
  };
  productPrice: number;
  imageUrl?: string;
  available?: number | string;
}

interface CatalogProductListItemProps {
  product: Product;
  onClick: (product: Product) => void;
}

const CatalogProductListItem: React.FC<CatalogProductListItemProps> = ({
  product,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="group bg-white p-4 md:p-6 rounded-[32px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:border-primary/10 transition-all duration-300 flex items-center gap-6 cursor-pointer"
      onClick={() => onClick(product)}
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 md:w-28 md:h-28 bg-[#F4F4F4] rounded-2xl flex-shrink-0 flex items-center justify-center p-4">
        <img
          src={product.imageUrl || "/assets/placeholder.png"}
          alt={product.productName}
          className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
             (e.target as HTMLImageElement).src = "/assets/placeholder.png";
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1 block">
          {product.category?.categoryName || "Houseware"}
        </span>
        <h3 className="text-lg md:text-xl font-bold text-secondary font-display group-hover:text-primary transition-colors truncate">
          {product.productName}
        </h3>
      </div>

      {/* Action Area */}
      <div className="flex flex-col md:flex-row items-end md:items-center gap-4 md:gap-8 flex-shrink-0">
        <p className="text-xl md:text-2xl font-black text-secondary">
          ₱{new Intl.NumberFormat().format(product.productPrice)}
        </p>
        <Button 
          className="rounded-xl h-[40px] px-6 bg-primary hover:bg-red-800 text-white border-none normal-case tracking-normal font-bold shadow-md shadow-primary/20"
        >
          View
        </Button>
      </div>
    </motion.div>
  );
};

export default CatalogProductListItem;
