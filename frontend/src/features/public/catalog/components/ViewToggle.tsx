"use client";

import React from "react";
import { LayoutGrid, List, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  priceType: string;
  onPriceTypeChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  priceType,
  onPriceTypeChange,
  sortBy,
  onSortChange,
}) => {
  const priceTypes = ["Retail", "Wholesale", "Bulk"];

  return (
    <div className="flex flex-col gap-4 md:gap-6 bg-white p-4 md:p-8 rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
      {/* Price Type Segments */}
      <div className="flex items-center gap-2 md:gap-4">
          <div className="flex p-1 md:p-1.5 bg-neutral-100 rounded-2xl gap-1">
            {priceTypes.map((type) => (
              <button
                key={type}
                onClick={() => onPriceTypeChange(type)}
                className={cn(
                  "px-3 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap",
                  priceType === type
                    ? "bg-primary text-white shadow-lg"
                    : "text-neutral-500 hover:text-neutral-700"
                )}
              >
                {type}
              </button>
            ))}
          </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4 w-full">
        {/* Sorting Dropdown */}
        <div className="relative group w-full md:w-[180px]">
          <button className="w-full flex items-center justify-between gap-2 px-3 md:px-5 py-2.5 md:py-3.5 bg-white border border-neutral-200 rounded-2xl text-xs md:text-sm font-bold text-neutral-700 hover:border-primary/30 transition-all">
            <span className="truncate">{sortBy}</span>
            <ChevronDown size={16} className="text-neutral-400 flex-shrink-0" />
          </button>
          
          <div className="absolute top-full right-0 mt-2 w-full bg-white border border-neutral-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
             {["Featured", "Price: Low → High", "Price: High → Low", "Best Rated"].map((opt) => (
               <button 
                key={opt}
                onClick={() => onSortChange(opt)}
                className="w-full px-3 md:px-5 py-2.5 md:py-3 text-left text-xs md:text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-primary transition-colors"
               >
                 {opt}
               </button>
             ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex p-1 bg-neutral-100 rounded-xl gap-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-2 md:p-2.5 rounded-lg transition-all",
              viewMode === "grid" ? "bg-primary text-white shadow-md" : "text-neutral-400 hover:text-neutral-600"
            )}
          >
            <LayoutGrid size={18} className="md:size-[20px]" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={cn(
              "p-2 md:p-2.5 rounded-lg transition-all",
              viewMode === "list" ? "bg-primary text-white shadow-md" : "text-neutral-400 hover:text-neutral-600"
            )}
          >
            <List size={18} className="md:size-[20px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewToggle;
