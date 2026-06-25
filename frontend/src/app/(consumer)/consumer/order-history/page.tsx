"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useFetchOrders } from "@/features/consumer/orders/hooks/useFetchOrders";
import { OrderHistoryTable } from "@/features/consumer/orders/components/OrderHistoryTable";
import { OrdersLoadingState } from "@/features/consumer/orders/components/OrdersLoadingState";
import { OrdersErrorState } from "@/features/consumer/orders/components/OrdersErrorState";
import { OrdersPaginationControls } from "@/features/consumer/orders/components//OrdersPaginationControls";
import { BottomBar } from "@/components/layout/bottomBar";

const RED = "#bf262f";
const ITEMS_PER_PAGE = 6;

export default function OrderHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { orders, loading, error, refetchOrders } = useFetchOrders();

  if (loading) {
    return (
      <>
        <div className="bg-white border-b border-gray-100 py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Link href="/b2b/home" className="hover:text-red-600">Home</Link>
                <ChevronDown size={10} className="-rotate-90" />
                <span className="text-gray-600">Order History</span>
              </div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Order History
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">Loading...</p>
            </div>
          </div>
        </div>
        <div className="min-h-screen bg-gray-50 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <OrdersLoadingState />
          </div>
        </div>
        <BottomBar />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-white border-b border-gray-100 py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Link href="/b2b/home" className="hover:text-red-600">Home</Link>
                <ChevronDown size={10} className="-rotate-90" />
                <span className="text-gray-600">Order History</span>
              </div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Order History
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">Error loading orders</p>
            </div>
          </div>
        </div>
        <div className="min-h-screen bg-gray-50 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <OrdersErrorState error={error || "Failed to load orders"} onRetry={refetchOrders} />
          </div>
        </div>
        <BottomBar />
      </>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = sortedOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <>
      <div className="bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Link href="/b2b/home" className="hover:text-red-600">Home</Link>
              <ChevronDown size={10} className="-rotate-90" />
              <span className="text-gray-600">Order History</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Order History
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">{sortedOrders.length} orders</p>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <OrderHistoryTable orders={paginatedOrders} RED={RED} />
          <OrdersPaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedOrders.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </div>
      <BottomBar />
    </>
  );
}
