import { Package } from "lucide-react";
import type { Order, OrderTabStatus } from "../types/order";
import { OrdersFilter } from "./OrdersFilter";
import { OrderRow } from "./Row-Container/OrderRow";
import { OrdersPaginationControls } from "./OrdersPaginationControls";

interface OrdersListProps {
  orders: Order[];
  activeTab: OrderTabStatus;
  setActiveTab: (tab: OrderTabStatus) => void;
  search: string;
  setSearch: (search: string) => void;
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  counts: Record<OrderTabStatus, number>;
  filtered: Order[];
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onUploadSuccess?: () => void;
}

export function OrdersList({
  activeTab,
  setActiveTab,
  search,
  setSearch,
  expanded,
  setExpanded,
  counts,
  filtered,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  onUploadSuccess,
}: OrdersListProps) {
  return (
    <div className="space-y-5">
      <OrdersFilter
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        search={search}
        setSearch={setSearch}
        counts={counts}
      />

      {/* Orders list */}
      <div className="bg-white rounded-xl p-5 flex flex-col">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="text-center">
              <Package size={32} className="mx-auto mb-3 opacity-40" />
              <div className="text-sm font-medium">No orders match your filters</div>
            </div>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((order, i) => (
              <OrderRow
                key={order.id}
                order={order}
                isExpanded={expanded === order.id}
                onExpand={setExpanded}
                index={i}
                isLastItem={i === filtered.length - 1}
                onUploadSuccess={onUploadSuccess}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <OrdersPaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        onNext={onNextPage}
        onPrevious={onPrevPage}
      />
    </div>
  );
}
