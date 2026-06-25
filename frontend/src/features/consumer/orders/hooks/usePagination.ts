"use client";

import { useState, useEffect } from "react";

interface UsePaginationOptions {
  itemsLength: number;
  itemsPerPage: number;
  resetOn?: (searchTerm: string | any) => void;
}

export function usePagination(itemsLength: number, itemsPerPage: number = 6) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(itemsLength / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const reset = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    reset,
  };
}
