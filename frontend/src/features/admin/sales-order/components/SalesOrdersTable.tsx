'use client';

import { MoreVertical, Edit2, Eye, FileText, Printer, X, Calendar, CreditCard, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getStatusLabel } from "@/utils/statusMapper";
import { formatDateLong } from "@/utils/dateFormatter";
import { CancelOrderConfirmDialog } from "../../../../components/modals/dialogs/CancelOrderConfirmDialog";
import { SalesOrder } from "../../../../types/types";

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, { bg: string; color: string }> = {
    PENDING_APPROVAL: { bg: "#fffbeb", color: "#d97706" },
    ACCEPT: { bg: "#dcfce7", color: "#16a34a" },
    DELIVERED: { bg: "#ecfdf5", color: "#16a34a" },
    PAID: { bg: "#f3f4f6", color: "#6b7280" },
    READY_FOR_BILLING: { bg: "#fef3c7", color: "#ca8a04" },
  };

  const style = statusColors[status] || { bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.color}30`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.color }} />
      {getStatusLabel(status)}
    </span>
  );
}

function OrderTypeBadge({ type }: { type: string }) {
  const typeColors: Record<string, { bg: string; color: string }> = {
    Bulk: { bg: "#f9e9ea", color: "#bf262f" },
    Wholesale: { bg: "#eff6ff", color: "#2563eb" },
    Retail: { bg: "#f0fdf4", color: "#16a34a" },
  };

  const style = typeColors[type] || typeColors["Retail"];
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: style.bg,
        color: style.color,
      }}
    >
      {type}
    </span>
  );
}

function PaymentMethodBadge({ method }: { method: string }) {
  const normalizedMethod = method === "e-payment" ? "paymongo" : method;
  const methodColors: Record<string, { bg: string; color: string }> = {
    paymongo: { bg: "#ecfdf5", color: "#059669" },
    manual_transfer: { bg: "#fef3c7", color: "#d97706" },
  };

  const style = methodColors[normalizedMethod] || methodColors.paymongo;
  const label = normalizedMethod === "paymongo" ? "PayMongo" : "Bank Transfer";

  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: style.bg,
        color: style.color,
      }}
    >
      {label}
    </span>
  );
}

function ActionsMenu({
  order,
  onViewDetails,
  onViewPaymentProof,
  onApprovePayment,
  onRejectPayment,
  onViewPaymongoDetails,
  onReportDiscrepancy,
  onViewInvoice,
  onCancelOrder,
  onAdjustDelivery,
  onUpdateStatus,
  onPrint,
}: {
  order: SalesOrder;
  onViewDetails?: (order: SalesOrder) => void;
  onViewPaymentProof?: (order: SalesOrder) => void;
  onApprovePayment?: (order: SalesOrder) => void;
  onRejectPayment?: (order: SalesOrder) => void;
  onViewPaymongoDetails?: (order: SalesOrder) => void;
  onReportDiscrepancy?: (order: SalesOrder) => void;
  onViewInvoice?: (order: SalesOrder) => void;
  onCancelOrder?: (order: SalesOrder) => void;
  onAdjustDelivery?: (order: SalesOrder) => void;
  onUpdateStatus?: (order: SalesOrder) => void;
  onPrint?: (order: SalesOrder) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Determine if verification action should be shown
  const needsVerification = order.status === "PENDING_APPROVAL" || order.status === "AWAITING_PAYMENT_VERIFICATION";
  const isPaymongoMethod = order.paymentMethod === "paymongo" || order.paymentMethod === "e-payment";
  const hasManualPaymentVerification = order.paymentMethod === "manual_transfer" && needsVerification;
  const hasPaymongoVerification = isPaymongoMethod && needsVerification;

  // Determine if update status button should show (after payment approved)
  const canUpdateStatus = order.status === "ACCEPT" || order.status === "PACKING" || order.status === "IN_TRANSIT";

  // Determine if cancel is allowed
  const canCancel = order.status === "PENDING_APPROVAL" || order.status === "ACCEPT";

  // Determine if print is allowed (ACCEPT, PACKING, READY_FOR_DELIVERY for warehouse)
  const canPrint = order.status === "ACCEPT" || order.status === "PACKING" || order.status === "READY_FOR_DELIVERY";

  // For ACCEPT, PACKING, READY_FOR_DELIVERY statuses: always show View Details + Update Status as direct buttons
  const isWarehouseStatus = order.status === "ACCEPT" || order.status === "PACKING" || order.status === "READY_FOR_DELIVERY";
  
  // Show menu only if there are other actions besides View Details and Update Status
  const hasOtherActions = canPrint || canCancel || canUpdateStatus;
  const showAsMenu = hasOtherActions;

  const handleAction = (callback?: (order: SalesOrder) => void) => {
    callback?.(order);
    setIsOpen(false);
  };

  const handleToggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left - 200,
    });
    setIsOpen(!isOpen);
  };

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
    setIsOpen(false);
  };

  const handleConfirmCancel = () => {
    handleAction(onCancelOrder);
    setCancelDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-2 relative">
      {/* Verification Quick Action - Shows as prominent icon when needed */}
      {hasManualPaymentVerification && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onViewPaymentProof?.(order);
          }}
          className="p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer hover:opacity-80"
          style={{
            backgroundColor: "#fdf2f2",
            border: "1px solid #bf262f",
            color: "#bf262f",
          }}
          title="Verify Payment Proof"
        >
          <FileText size={16} />
        </button>
      )}

      {hasPaymongoVerification && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onViewPaymongoDetails) {
              onViewPaymongoDetails(order);
            } else {
            }
          }}
          className="p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer hover:opacity-80"
          style={{
            backgroundColor: "#fdf2f2",
            border: "1px solid #bf262f",
            color: "#bf262f",
          }}
          title="Verify Transaction"
        >
          <CreditCard size={16} />
        </button>
      )}

      {/* Direct View Details + Update Status Buttons - Always for warehouse statuses */}
      {isWarehouseStatus && (
        <>
          <button
            onClick={() => onViewDetails?.(order)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          {canUpdateStatus && (
            <button
              onClick={() => onUpdateStatus?.(order)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
              title="Update Status"
            >
              <Zap size={16} />
            </button>
          )}
        </>
      )}

      {/* More Actions Menu - Only for warehouse status with other actions, or default behavior for other statuses */}
      {(showAsMenu) && (
        <button
          ref={buttonRef}
          onClick={handleToggleMenu}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          title="More actions"
        >
          <MoreVertical size={16} />
        </button>
      )}

      {/* Direct View Details Button - Show when only 1 action available and NOT warehouse status */}
      {!isWarehouseStatus && showAsMenu === false && (
        <button
          onClick={() => onViewDetails?.(order)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          title="View Details"
        >
          <Eye size={16} />
        </button>
      )}

      {isOpen && showAsMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu - Fixed positioning to viewport */}
          <div
            ref={menuRef}
            className="fixed w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
          >

            {/* Print - For warehouse statuses */}
            {isWarehouseStatus && canPrint && (
              <button
                onClick={() => handleAction(onPrint)}
                className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-2 transition-colors"
                style={{
                  color: "#2563eb",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eff6ff")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Printer size={14} />
                Print
              </button>
            )}

            {/* Cancel Order - For warehouse statuses */}
            {isWarehouseStatus && canCancel && (
              <button
                onClick={handleCancelClick}
                className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-2 transition-colors"
                style={{
                  color: "#dc2626",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <X size={14} />
                Cancel Order
              </button>
            )}

            {/* Cancel Order - For non-warehouse statuses */}
            {!isWarehouseStatus && canCancel && (
              <button
                onClick={handleCancelClick}
                className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-2 transition-colors"
                style={{
                  color: "#dc2626",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <X size={14} />
                Cancel Order
              </button>
            )}

            {/* Update Status - For non-warehouse statuses */}
            {!isWarehouseStatus && canUpdateStatus && (
              <button
                onClick={() => handleAction(onUpdateStatus)}
                className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-2 transition-colors border-t border-gray-100"
                style={{
                  color: "#9333ea",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#faf5ff")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Zap size={14} />
                Update Status
              </button>
            )}
          </div>
        </>
      )}

      <CancelOrderConfirmDialog
        isOpen={cancelDialogOpen}
        orderNumber={order.orderNumber}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelDialogOpen(false)}
      />
    </div>
  );
}

interface SalesOrdersTableProps {
  orders: SalesOrder[];
  emptyMessage?: string;
  onViewDetails?: (order: SalesOrder) => void;
  onViewPaymentProof?: (order: SalesOrder) => void;
  onApprovePayment?: (order: SalesOrder) => void;
  onRejectPayment?: (order: SalesOrder) => void;
  onViewPaymongoDetails?: (order: SalesOrder) => void;
  onReportDiscrepancy?: (order: SalesOrder) => void;
  onViewInvoice?: (order: SalesOrder) => void;
  onCancelOrder?: (order: SalesOrder) => void;
  onAdjustDelivery?: (order: SalesOrder) => void;
  onUpdateStatus?: (order: SalesOrder) => void;
  onPrint?: (order: SalesOrder) => void;
}

export function SalesOrdersTable({
  orders,
  emptyMessage = "No sales orders found",
  onViewDetails,
  onViewPaymentProof,
  onApprovePayment,
  onRejectPayment,
  onViewPaymongoDetails,
  onReportDiscrepancy,
  onViewInvoice,
  onCancelOrder,
  onAdjustDelivery,
  onUpdateStatus,
  onPrint,
}: SalesOrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm" style={{ minWidth: "100%" }}>
          <thead>
            <tr
              className="border-b border-gray-100"
              style={{ backgroundColor: "#fafafa" }}
            >
              {[
                "SO Number",
                "Customer",
                "Type",
                "Payment",
                "Date",
                "Delivery",
                "Amount",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-600 whitespace-nowrap">
                    {order.orderNumber}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-800 whitespace-nowrap">
                      Customer #{order.userId}
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.lineItemCount && order.lineItemCount > 1
                        ? `${order.lineItemCount} products`
                        : `Product #${order.productId}`}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <OrderTypeBadge type={order.orderType || "Retail"} />
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <PaymentMethodBadge method={order.paymentMethod || ""} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                    {order.createdAt ? formatDateLong(order.createdAt) : '-'}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <StatusBadge status={order.deliveryStatus || ""} />
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800 whitespace-nowrap">
                    ₱{(order.payableTotal ?? order.grandTotal ?? order.totalPrice ?? 0).toLocaleString('en-PH')}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex justify-center">
                      <ActionsMenu
                        order={order}
                        onViewDetails={onViewDetails}
                        onViewPaymentProof={onViewPaymentProof}
                        onApprovePayment={onApprovePayment}
                        onRejectPayment={onRejectPayment}
                        onViewPaymongoDetails={onViewPaymongoDetails}
                        onReportDiscrepancy={onReportDiscrepancy}
                        onViewInvoice={onViewInvoice}
                        onCancelOrder={onCancelOrder}
                        onAdjustDelivery={onAdjustDelivery}
                        onUpdateStatus={onUpdateStatus}
                        onPrint={onPrint}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-8 text-center text-sm text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderTop: "1px solid #f1f5f9", background: "#fafafa" }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
            style={{
              borderColor: currentPage === 1 ? "#e5e7eb" : "#d1d5db",
              color: currentPage === 1 ? "#d1d5db" : "#6b7280",
              backgroundColor: currentPage === 1 ? "#f3f4f6" : "white",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            ← Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                style={{
                  backgroundColor: currentPage === page ? "#bf262f" : "#f3f4f6",
                  color: currentPage === page ? "white" : "#6b7280",
                  border: currentPage === page ? "1px solid #bf262f" : "1px solid #e5e7eb",
                  cursor: "pointer",
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
            style={{
              borderColor: currentPage === totalPages ? "#e5e7eb" : "#d1d5db",
              color: currentPage === totalPages ? "#d1d5db" : "#6b7280",
              backgroundColor: currentPage === totalPages ? "#f3f4f6" : "white",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next →
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#6b7280" }}>
          Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of {orders.length} orders
        </p>
      </div>
    </div>
  );
}
