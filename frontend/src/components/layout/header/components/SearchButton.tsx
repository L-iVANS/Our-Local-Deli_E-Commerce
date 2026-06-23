"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  textColor: string;
}

/**
 * Header search icon button.
 */
export function SearchButton({ textColor }: SearchButtonProps) {
  return (
    <button
      className={cn("transition-colors hover:text-accent", textColor)}
      aria-label="Search"
    >
      <Search size={22} />
    </button>
  );
}
