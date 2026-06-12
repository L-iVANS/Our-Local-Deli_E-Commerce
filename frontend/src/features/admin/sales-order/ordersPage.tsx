// features/admin/sales-order/page.tsx
'use client';

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Download, Plus, Search, Filter } from "lucide-react";
import { SalesOrdersTable } from "@/features/admin/sales-order/components/SalesOrdersTable";
import { PaymentProofModal } from "@/features/admin/sales-order/components/PaymentProofModal";
import { PaymongoTransactionModal } from "@/features/admin/sales-order/components/PaymongoTransactionModal";
import { OrderDetailsModal } from "@/features/admin/sales-order/components/OrderDetailsModal";
import { UpdateOrderStatusModal } from "@/features/admin/sales-order/components/UpdateOrderStatusModal";
import { useOrders } from "@/features/admin/sales-order/hooks";
import { useTransitionOrderStatus } from "@/features/admin/sales-order/hooks/use-transitionorderstatus";
import { useRejectPaymentProof } from "@/features/admin/sales-order/hooks/use-reject-payment-proof";
import { useCancelOrder } from "@/features/admin/sales-order/hooks/use-cancel-order";
import { getStatusLabel, getStatusColor } from "@/utils/statusMapper";
import { SalesOrder } from "../../../types/types";
import { toast } from "sonner";
import { toOrderStatus } from '@/utils/orderStatus';

const getDiscountRate = (itemCount: number) => {
  if (itemCount <= 0) return 0;
  if (itemCount <= 10) return 0.1;
  if (itemCount <= 20) return 0.2;
  return 0.3;
};

export default function SalesOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewPaymentProofParam = searchParams?.get("viewPaymentProof");
  const processedRef = useRef<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [paymentProofOrder, setPaymentProofOrder] = useState<SalesOrder | null>(null);
  const [paymentProofLoading, setPaymentProofLoading] = useState(false);
  const [paymongoTransactionOrder, setPaymongoTransactionOrder] = useState<SalesOrder | null>(null);
  const [paymongoTransactionLoading, setPaymongoTransactionLoading] = useState(false);
  const [updateStatusOrder, setUpdateStatusOrder] = useState<SalesOrder | null>(null);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);

  // ──────────────────────────────────────────────────────────
  // FIX 1: useQuery returns object with { data, isLoading, error }
  //         data IS Order[] directly — no .allOrders property
  // FIX 2: useMutation returns object, not array — destructure with {}
  // FIX 3: isLoading instead of loading
  // FIX 4: mutation functions take input directly, no { variables: { input } } wrapping
  // ──────────────────────────────────────────────────────────

  const { data: ordersDataRaw, isLoading, error } = useOrders();
  const { transitionOrderStatus, isPending: isTransitionPending } = useTransitionOrderStatus();
  const { rejectPaymentProof, isPending: isRejectPending } = useRejectPaymentProof();
  const { cancelOrder: cancelOrderMutation, isPending: isCancelPending } = useCancelOrder();

  // Group line items by orderNumber so admin table shows one row per sales order.
  const ordersData: SalesOrder[] = useMemo(() => {
    // FIX 1: data IS the array, not data.allOrders
    const source = ordersDataRaw || [];
    const groupedByOrderNumber = new Map<string, any[]>();

    for (const order of source) {
      const orderNumber = order.orderNumber || order.orderId?.toString() || "";
      if (!groupedByOrderNumber.has(orderNumber)) {
        groupedByOrderNumber.set(orderNumber, []);
      }
      groupedByOrderNumber.get(orderNumber)!.push(order);
    }

    const groupedOrders: SalesOrder[] = [];

    for (const [orderNumber, orders] of groupedByOrderNumber) {
      const sortedOrders = [...orders].sort((a, b) => (a.orderId || 0) - (b.orderId || 0));
      const primaryOrder = sortedOrders[0];
      const latestProofOrder =
        [...sortedOrders]
          .filter((o) => Boolean(o.paymentProofImage))
          .sort(
            (a, b) =>
              new Date(b.paymentProofUploadedAt || b.updatedAt || b.createdAt || 0).getTime() -
              new Date(a.paymentProofUploadedAt || a.updatedAt || a.createdAt || 0).getTime()
          )[0] || primaryOrder;

      const totalQuantity = sortedOrders.reduce((sum, o) => sum + (o.quantity || 0), 0);
      const subtotalBeforeDiscount = sortedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const discountRate = getDiscountRate(totalQuantity);
      const discountAmount = Math.round(subtotalBeforeDiscount * discountRate);
      const discountedSubtotal = subtotalBeforeDiscount - discountAmount;
      const deliveryFee = primaryOrder.deliveryFee ?? (subtotalBeforeDiscount >= 1500 ? 0 : 350);
      const grandTotal = primaryOrder.grandTotal ?? (discountedSubtotal + deliveryFee);

      groupedOrders.push({
        orderId: primaryOrder.orderId?.toString() || "",
        rawOrderIds: sortedOrders
          .map((o) => o.orderId?.toString())
          .filter((id): id is string => Boolean(id)),
        lineItemCount: sortedOrders.length,
        orderedProducts: sortedOrders.map((o) => ({
          productId: o.productId || 0,
          productName: o.productName || o.product?.productName || "",
          quantity: o.quantity || 0,
          unitPrice: o.unitPrice || 0,
          totalPrice: o.totalPrice || 0,
        })),
        orderNumber,
        userId: primaryOrder.userId || 0,
        productId: primaryOrder.productId || 0,
        orderType: primaryOrder.orderType || "",
        quantity: totalQuantity,
        unitPrice: primaryOrder.unitPrice || 0,
        totalPrice: subtotalBeforeDiscount,
        subtotalBeforeDiscount,
        discountRate,
        discountAmount,
        discountedSubtotal,
        deliveryFee,
        grandTotal,
        payableTotal: grandTotal,
        status: primaryOrder.status || "PENDING_APPROVAL",
        deliveryStatus: primaryOrder.deliveryStatus || "",
        paymentMethod: primaryOrder.paymentMethod || "",
        paymentProofImage: latestProofOrder?.paymentProofImage
          ? `${process.env.NEXT_PUBLIC_IMAGE_PATH}${latestProofOrder.paymentProofImage}`
          : "",
        paymentProofUploadedAt: latestProofOrder?.paymentProofUploadedAt || "",
        paymentProofStatus: latestProofOrder?.paymentProofStatus || primaryOrder.paymentProofStatus || "",
        paymentProofRejectionReason:
          latestProofOrder?.paymentProofRejectionReason || primaryOrder.paymentProofRejectionReason || "",
        paymentProofAttempts: latestProofOrder?.paymentProofAttempts || primaryOrder.paymentProofAttempts || 0,
        paymongoTransactionId: primaryOrder.paymongoTransactionId || "",
        paymongoAmount: primaryOrder.paymongoAmount || 0,
        paymongoPaymentMethod: primaryOrder.paymongoPaymentMethod || "",
        paymongoTimestamp: primaryOrder.paymongoTimestamp || "",
        createdAt: primaryOrder.createdAt || "",
        updatedAt: primaryOrder.updatedAt || "",
      });
    }

    return groupedOrders.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [ordersDataRaw]);

  // Auto-open payment proof modal if coming from notification
  useEffect(() => {
    if (viewPaymentProofParam && ordersData.length > 0 && processedRef.current !== viewPaymentProofParam) {
      const orderId = parseInt(viewPaymentProofParam, 10);
      const orderToView = ordersData.find((o) =>
        o.rawOrderIds?.some((id) => parseInt(id, 10) === orderId) || parseInt(o.orderId, 10) === orderId
      );
      if (orderToView) {
        setPaymentProofOrder(orderToView);
        processedRef.current = viewPaymentProofParam;
      }
    } else if (!viewPaymentProofParam) {
      processedRef.current = null;
    }
  }, [viewPaymentProofParam, ordersData]);

  // ─── FIX 3: loading → isLoading ───
  if (isLoading) {
    return (
      <div className="space-y-6 px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold">Error loading orders</p>
            <p className="mt-2 text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const totalOrders = ordersData.length;
  const totalAmount = ordersData.reduce((sum, o) => sum + (o.payableTotal ?? o.totalPrice), 0);

  const statusCards = [
    {
      label: "PENDING_APPROVAL",
      count: ordersData.filter((o) => o.status === "PENDING_APPROVAL").length,
      amount: ordersData.filter((o) => o.status === "PENDING_APPROVAL").reduce((s, o) => s + (o.payableTotal ?? o.totalPrice), 0),
    },
    {
      label: "ACCEPT",
      count: ordersData.filter((o) => o.status === "ACCEPT").length,
      amount: ordersData.filter((o) => o.status === "ACCEPT").reduce((s, o) => s + (o.payableTotal ?? o.totalPrice), 0),
    },
    {
      label: "IN_TRANSIT",
      count: ordersData.filter((o) => o.status === "IN_TRANSIT").length,
      amount: ordersData.filter((o) => o.status === "IN_TRANSIT").reduce((s, o) => s + (o.payableTotal ?? o.totalPrice), 0),
    },
    {
      label: "DELIVERED",
      count: ordersData.filter((o) => o.status === "DELIVERED").length,
      amount: ordersData.filter((o) => o.status === "DELIVERED").reduce((s, o) => s + (o.payableTotal ?? o.totalPrice), 0),
    },
  ];

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.toString().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: SalesOrder) => {
    setSelectedOrder(order);
  };

  const handleViewPaymentProof = (order: SalesOrder) => {
    setPaymentProofOrder(order);
  };

  const handleClosePaymentProofModal = () => {
    setPaymentProofOrder(null);
    router.push('/admin/sales-order');
  };

  // ──────────────────────────────────────────────────────────
  // FIX 4: All mutation calls now take input directly
  //         No more { variables: { input: {...} } }
  // ──────────────────────────────────────────────────────────

  const handleApprovePayment = async (order: SalesOrder) => {
    if (order.status !== "AWAITING_PAYMENT_VERIFICATION") {
      toast.error(`Cannot approve payment proof for status: ${getStatusLabel(order.status)}`);
      return;
    }

    setPaymentProofLoading(true);
    try {
      await transitionOrderStatus({
        orderId: parseInt(order.orderId),
        nextStatus: "ACCEPT",
      });
      toast.success("Payment approved successfully!");
      handleClosePaymentProofModal();
    } catch (error) {
      console.error("Failed to approve payment:", error);
      toast.error("Failed to approve payment");
    } finally {
      setPaymentProofLoading(false);
    }
  };

  const handleRejectPayment = async (order: SalesOrder, reason?: string) => {
    setPaymentProofLoading(true);
    try {
      if (!reason) {
        toast.error("Rejection reason is required");
        setPaymentProofLoading(false);
        return;
      }

      await rejectPaymentProof({
        orderId: parseInt(order.orderId),
        rejectionReason: reason,
      });
      toast.success("Payment proof rejected successfully");
      console.log("✅ Payment rejected with reason:", reason);
      handleClosePaymentProofModal();
    } catch (error) {
      console.error("Failed to reject payment:", error);
      toast.error("Failed to reject payment");
    } finally {
      setPaymentProofLoading(false);
    }
  };

  const handleViewPaymongoDetails = (order: SalesOrder) => {
    setPaymongoTransactionOrder(order);
  };

  const handlePaymongoStatusUpdate = async (order: SalesOrder, nextStatus: string) => {
    setPaymongoTransactionLoading(true);
    try {
      await transitionOrderStatus({
        orderId: parseInt(order.orderId),
        nextStatus: toOrderStatus(nextStatus), 
      });
      toast.success(`Order updated to ${getStatusLabel(nextStatus)}`);
      setPaymongoTransactionOrder(null);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setPaymongoTransactionLoading(false);
    }
  };

  const handleReportDiscrepancy = async (order: SalesOrder) => {
    setPaymongoTransactionLoading(true);
    try {
      await transitionOrderStatus({
        orderId: parseInt(order.orderId),
        nextStatus: "REJECTED",
        rejectionReason: "Discrepancy reported - flagged for manual review",
      });
      toast.success("Discrepancy reported - order flagged for manual review");
      setPaymongoTransactionOrder(null);
    } catch (error) {
      console.error("Failed to report discrepancy:", error);
      toast.error("Failed to report discrepancy");
    } finally {
      setPaymongoTransactionLoading(false);
    }
  };

  const handleViewInvoice = (order: SalesOrder) => {
    console.log("View invoice:", order);
  };

  const handleCancelOrder = async (order: SalesOrder) => {
    try {
      await cancelOrderMutation(parseInt(order.orderId));
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const handleAdjustDelivery = (order: SalesOrder) => {
    console.log("Adjust delivery:", order);
  };

  const handleUpdateStatus = (order: SalesOrder) => {
    setUpdateStatusOrder(order);
  };

  const handleStatusUpdateSubmit = async (newStatus: string) => {
    if (!updateStatusOrder) return;

    setUpdateStatusLoading(true);
    try {
      await transitionOrderStatus({
        orderId: parseInt(updateStatusOrder.orderId),
        nextStatus: toOrderStatus(newStatus),
      });
      toast.success("Order status updated successfully!");
      setUpdateStatusOrder(null);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const handlePrint = (order: SalesOrder) => {
    console.log("Print order:", order);
  };

  return (
    <div className="space-y-6 px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-gray-900 font-bold text-2xl">Sales Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sales Org: 1000</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {totalOrders} orders · Total: ₱{totalAmount.toLocaleString('en-PH')}
          </span>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statusCards.map(({ label, count, amount }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-400 mb-1">{getStatusLabel(label)}</div>
            <div
              className="font-bold"
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                lineHeight: 1.2,
                color: getStatusColor(label).text,
              }}
            >
              {count}
            </div>
            <div className="text-xs text-gray-400">
              ₱{amount.toLocaleString('en-PH')}
            </div>
          </div>
        ))}
      </div>

      {/* Search, Filter & Add Button Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by order number or customer..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Filter size={14} />
            Filter
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["all", "PENDING_APPROVAL", "ACCEPT", "DELIVERED", "PAID"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className="px-3 py-2 rounded-lg text-xs font-medium transition-all text-left"
                      style={{
                        backgroundColor:
                          selectedStatus === status ? "#fdf2f2" : "#f9fafb",
                        color:
                          selectedStatus === status ? "#bf262f" : "#6b7280",
                        border:
                          selectedStatus === status
                            ? "1px solid #bf262f"
                            : "1px solid #e5e7eb",
                      }}
                    >
                      {status === "all" ? "All Status" : getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedStatus("all");
                }}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 shadow-sm"
          style={{ backgroundColor: "#bf262f" }}
        >
          <Plus size={14} />
          New Order
        </button>
      </div>

      <SalesOrdersTable
        orders={filteredOrders}
        emptyMessage="No sales orders found matching your filters"
        onViewDetails={handleViewDetails}
        onViewPaymentProof={handleViewPaymentProof}
        onApprovePayment={handleApprovePayment}
        onRejectPayment={handleRejectPayment}
        onViewPaymongoDetails={handleViewPaymongoDetails}
        onReportDiscrepancy={handleReportDiscrepancy}
        onViewInvoice={handleViewInvoice}
        onCancelOrder={handleCancelOrder}
        onAdjustDelivery={handleAdjustDelivery}
        onUpdateStatus={handleUpdateStatus}
        onPrint={handlePrint}
      />

      {paymentProofOrder && (
        <PaymentProofModal
          isOpen={!!paymentProofOrder}
          order={paymentProofOrder}
          onClose={handleClosePaymentProofModal}
          onApprove={() => handleApprovePayment(paymentProofOrder)}
          onReject={(order, reason) => handleRejectPayment(order, reason)}
          isLoading={paymentProofLoading}
        />
      )}

      {paymongoTransactionOrder && (
        <PaymongoTransactionModal
          isOpen={!!paymongoTransactionOrder}
          order={paymongoTransactionOrder}
          onClose={() => setPaymongoTransactionOrder(null)}
          onUpdateStatus={handlePaymongoStatusUpdate}
          onReportDiscrepancy={() => handleReportDiscrepancy(paymongoTransactionOrder)}
          isLoading={paymongoTransactionLoading}
        />
      )}

      {selectedOrder && (
        <OrderDetailsModal
          isOpen={!!selectedOrder}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {updateStatusOrder && (
        <UpdateOrderStatusModal
          isOpen={!!updateStatusOrder}
          orderNumber={updateStatusOrder.orderNumber}
          currentStatus={updateStatusOrder.status}
          onClose={() => setUpdateStatusOrder(null)}
          onUpdate={handleStatusUpdateSubmit}
          isLoading={updateStatusLoading}
        />
      )}
    </div>
  );
}