"use client";

import React from "react";
import { Search } from "lucide-react";
import Link from "next/link";

interface CatalogHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  productCount: number;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  searchTerm,
  onSearchChange,
  productCount,
}) => {
  return (
    <div className="w-full bg-white border-b border-gray-100 mt-16 md:mt-24 pb-8 md:pb-12">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-6 md:mb-8 pt-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>›</span>
          <span className="text-neutral-600 font-medium">Catalog</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-display font-black text-secondary tracking-tight">
              Full Catalog
            </h1>
            <p className="text-neutral-500 font-medium">{productCount} products</p>
          </div>

          <div className="relative w-full md:w-87.5">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#F4F4F4] border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 pl-12 pr-6 outline-none transition-all duration-300 font-medium text-secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogHeader;
