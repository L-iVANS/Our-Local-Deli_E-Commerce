"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Order } from "../types/order";
import { getStatusLabel } from "@/utils/statusMapper";

interface OrderHistoryTableProps {
  orders: Order[];
  RED: string;
}

interface StatusStyle {
  bg: string;
  text: string;
  icon: React.ReactNode;
}

const STATUS_STYLE: Record<string, StatusStyle> = {
  "PENDING_APPROVAL": { bg: "#fef3c7", text: "#92400e", icon: "⏳" },
  "ACCEPT": { bg: "#dcfce7", text: "#15803d", icon: "✓" },
  "REJECTED": { bg: "#fee2e2", text: "#dc2626", icon: "✕" },
  "CANCELLED": { bg: "#f3f4f6", text: "#6b7280", icon: "✕" },
  "Processing": { bg: "#dbeafe", text: "#0369a1", icon: "⚙️" },
};

export function OrderHistoryTable({ orders, RED }: OrderHistoryTableProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden py-12 flex flex-col items-center justify-center">
        <p className="text-gray-400 text-sm">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h2 
          className="text-gray-900 font-semibold text-lg"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Order History
        </h2>
        <Link href="/b2b/cart" style={{ color: RED }} className="text-xs font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity">
          New Order <ArrowRight size={12} />
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Items</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = order.status || "PENDING_APPROVAL";
              const s = STATUS_STYLE[status] || STATUS_STYLE["Processing"];
              const displayLabel = getStatusLabel(status);
              
              return (
                <tr
                  key={order.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="text-gray-800 font-medium text-xs">{order.sapSo}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs hidden sm:table-cell">
                    {order.date ? new Date(order.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs text-right hidden md:table-cell">
                    {order.items?.length || 0} pcs
                  </td>
                  <td className="px-5 py-3.5 text-gray-900 font-semibold text-xs text-right">
                    ₱{order.total?.toLocaleString() || "0"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: s.bg, color: s.text }}
                    >
                      {displayLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
