import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHorizontalScroller } from "./hooks/useHorizontalScroller";

const {
  scrollRef,
  canScrollPrev,
  canScrollNext,
  scrollProgress,
  scrollPrev,
  scrollNext,
} = useHorizontalScroller();