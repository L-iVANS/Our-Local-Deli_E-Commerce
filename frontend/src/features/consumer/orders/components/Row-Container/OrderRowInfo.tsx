"use client";

import type { Order } from "../../types/order";
import { STATUS_CONFIG, PAY_CONFIG } from "../../constants/orderConfig";
import { getStatusLabel } from "@/utils/statusMapper";
import { formatDateWithTime2DigitYear } from "@/utils/dateFormatter";

interface OrderRowInfoProps {
  order: Order;
}

export function OrderRowInfo({ order }: OrderRowInfoProps) {
  const StatusIcon = STATUS_CONFIG[order.status]?.icon;
  const showPaymentStatusBadge = !(
    (
      order.status === "ACCEPT" ||
      order.status === "DELIVERED" ||
      order.status === "REJECTED" ||
      order.status === "CANCELLED"
    ) &&
    order.paymentStatus === "Pending"
  );

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-sm font-bold text-gray-800">
          {order.id}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded font-medium"
          style={{ backgroundColor: "#f1f5f9", color: "#475569" }}
        >
          {order.sapSo}
        </span>
        <span
          className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: STATUS_CONFIG[order.status]?.bg,
            color: STATUS_CONFIG[order.status]?.color,
          }}
        >
          {StatusIcon && <StatusIcon size={10} />}
          {getStatusLabel(order.status)}
        </span>
        {order.status === "ACCEPT" && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium animate-pulse"
            style={{
              backgroundColor: "#dbeafe",
              color: "#0284c7",
            }}
          >
            ⚙️ Processing
          </span>
        )}
        {showPaymentStatusBadge && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: PAY_CONFIG[order.paymentStatus]?.bg,
              color: PAY_CONFIG[order.paymentStatus]?.color,
            }}
          >
            {order.paymentStatus}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
        <span className="text-xs text-gray-500">Ordered: {formatDateWithTime2DigitYear(order.date)}</span>
        {order.deliveryDate && (
          <span className="text-xs text-gray-500">
            {order.status === "DELIVERED" ? "Delivered" : "ETA"}:{" "}
            {order.deliveryDate}
          </span>
        )}
      </div>
      
      {/* Payment Proof Rejection Alert - No attempt counter shown to client */}
      {order.paymentProofStatus === 'rejected' && (
        <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
          <p className="text-xs font-semibold text-red-700">Payment Proof Rejected</p>
          <p className="text-xs text-red-600 mt-0.5">{order.paymentProofRejectionReason}</p>
          <p className="text-xs text-red-500 mt-1">Please upload new proof</p>
        </div>
      )}

      <div className="text-xs text-gray-600 mt-1 truncate">
        {order.items.map((it) => `${it.name} ×${it.qty}`).join(" · ")}
      </div>
    </div>
  );
}
