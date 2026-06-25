"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth";
import { useOrders } from "./hooks/useOrders";
import { useFetchOrders } from "./hooks/useFetchOrders";
import { useMostOrderedItems } from "./hooks/useMostOrderedItems";
import { usePagination } from "./hooks/usePagination";
import { useSummaryItems } from "./hooks/useSummaryItems";
import { OrdersPageHeader } from "./components/OrdersPageHeader";
import { OrdersSummary } from "./components/OrdersSummary";
import { OrdersLoadingState } from "./components/OrdersLoadingState";
import { OrdersErrorState } from "./components/OrdersErrorState";
import { OrdersMainContent } from "./components/OrdersMainContent";
import { BottomBar } from "@/components/layout/bottomBar";

const ITEMS_PER_PAGE = 6;

export function MyOrdersPage() {
  const searchParams = useSearchParams();
  const expandOrderId = searchParams?.get("expandOrderId");
  const { user } = useAuth(); // Get current user info

  // Fetch orders from backend
  const { orders, loading, error, refetchOrders } = useFetchOrders();

  // Filter and search logic
  const { activeTab, setActiveTab, search, setSearch, expanded, setExpanded, filtered, counts } = useOrders(orders);

  // Pagination
  const pagination = usePagination(filtered.length, ITEMS_PER_PAGE);

  // Summary statistics
  const summaryItems = useSummaryItems(orders);

  // Quick reorder items
  const quickReorderItems = useMostOrderedItems(orders);

  // Auto-expand order if coming from payment upload
  useEffect(() => {
    if (expandOrderId && orders.length > 0) {
      // Find the order by ID (expandOrderId is a string from URL)
      const orderToExpand = orders.find(order => order.id === expandOrderId);
      if (orderToExpand) {
        setExpanded(orderToExpand.id);
      }
    }
  }, [expandOrderId, orders, setExpanded]);

  // Handle pagination reset on search/filter change
  useEffect(() => {
    pagination.reset();
  }, [search, activeTab]);

  // Get paginated items
  const paginatedFiltered = filtered.slice(pagination.startIndex, pagination.endIndex);

  // Handle error retry
  const handleRetry = () => {
    refetchOrders();
  };

  if (loading) {
    return <OrdersLoadingState />;
  }

  if (error) {
    return <OrdersErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <OrdersPageHeader 
        ordersCount={counts.All || orders.length}
      />

      {/* Notification Bar removed - using dropdown notifications instead */}

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Summary of Orders */}
          <div className="space-y-6">
            <OrdersSummary items={summaryItems} />

            {/* Orders List + Sidebar */}
            <OrdersMainContent
              orders={orders}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              search={search}
              setSearch={setSearch}
              expanded={expanded}
              setExpanded={setExpanded}
              counts={counts}
              filteredOrders={paginatedFiltered}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onNextPage={pagination.nextPage}
              onPrevPage={pagination.prevPage}
              // quickReorderItems={quickReorderItems}
              onUploadSuccess={refetchOrders}
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <BottomBar />
    </div>
  );
}

export default MyOrdersPage;
