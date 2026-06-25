"use client";

import { OrdersList } from "./OrdersList";
// import { QuickReorder } from "./QuickReorder";
import type { Order, OrderStatus, OrderTabStatus } from "../types/order";

interface OrdersMainContentProps {
  orders: Order[];
  activeTab: OrderTabStatus;
  setActiveTab: (tab: OrderTabStatus) => void;
  search: string;
  setSearch: (search: string) => void;
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  counts: Record<OrderTabStatus, number>;
  filteredOrders: Order[];
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  // quickReorderItems: Array<{ id: string; name: string; sku: string; price: number; lastQty: number; stock: number }>;
  onUploadSuccess?: () => void;
}

export function OrdersMainContent({
  orders,
  activeTab,
  setActiveTab,
  search,
  setSearch,
  expanded,
  setExpanded,
  counts,
  filteredOrders,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  // quickReorderItems,
  onUploadSuccess,
}: OrdersMainContentProps) {
  return (
    <div className="w-full">
      {/* Main Orders List - Full width */}
      <div className="w-full">
        <OrdersList
          orders={orders}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          expanded={expanded}
          setExpanded={setExpanded}
          counts={counts}
          filtered={filteredOrders}
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          onUploadSuccess={onUploadSuccess}
        />
      </div>

      {/* Sidebar - Quick Reorder */}
      {/* <div className="lg:col-span-1">
        <QuickReorder items={quickReorderItems} />
      </div> */}
    </div>
  );
}
