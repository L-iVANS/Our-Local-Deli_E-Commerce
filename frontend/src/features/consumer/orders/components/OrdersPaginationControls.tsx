"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrdersPaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function OrdersPaginationControls({
  currentPage,
  totalPages,
  totalItems,
  onPrevious,
  onNext,
}: OrdersPaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
      <div className="text-xs text-gray-500">
        Page {currentPage} of {totalPages} ({totalItems} total orders)
      </div>
      <div className="flex gap-2">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
