"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { categoriesData } from "@/data/categoriesData";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterPanelProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => onCategorySelect(null)}
        className={cn(
          "px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 border-2",
          selectedCategoryId === null
            ? "bg-primary border-primary text-white"
            : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
        )}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 border-2",
            selectedCategoryId === category.id
              ? "bg-primary border-primary text-white"
              : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default FilterPanel;
