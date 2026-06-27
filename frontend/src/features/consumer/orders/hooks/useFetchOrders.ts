"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { fetchCustomerOrders, fetchAllOrders } from "../services/orderService";
import type { Order } from "../types/order";

/**
 * Map backend order response to frontend Order interface
 */
function mapBackendOrderToOrder(backendOrder: any): Order {
  const derivedStatus =
    backendOrder.paymentProofStatus === "rejected"
      ? "REJECTED"
      : mapOrderStatus(backendOrder.status);

  return {
    id: backendOrder.orderId?.toString() || backendOrder.orderNumber || "",
    sapSo: backendOrder.orderNumber || "",
    date: backendOrder.createdAt || new Date().toLocaleDateString(),
    customer: "", // Backend doesn't return customer name, may need to join with users table
    items: [],
    subtotal: 0,
    vat: 0,
    // Use grandTotal if available (from first item in group with delivery fee), otherwise use totalPrice
    total: backendOrder.grandTotal || backendOrder.totalPrice || 0,
    status: derivedStatus,
    paymentStatus: "Pending",
    deliveryMethod: backendOrder.deliveryStatus || "Standard",
    paymentMethod: backendOrder.paymentMethod || undefined,
  };
}

/**
 * Group orders by orderNumber and calculate totals
 */
function groupAndMapOrders(backendOrders: any[]): Order[] {
  const groupedByOrderNumber = new Map<string, any[]>();

  // Group all orders by orderNumber
  for (const order of backendOrders) {
    const orderNumber = order.orderNumber || order.orderId.toString();
    if (!groupedByOrderNumber.has(orderNumber)) {
      groupedByOrderNumber.set(orderNumber, []);
    }
    groupedByOrderNumber.get(orderNumber)!.push(order);
  }

  // Transform each group into a single Order object
  const mappedOrders: Order[] = [];
  for (const [orderNumber, orders] of groupedByOrderNumber) {
    const sortedOrders = [...orders].sort(
      (a, b) => (a.orderId || 0) - (b.orderId || 0),
    );
    const primaryOrder =
      sortedOrders.find(
        (o) => o.deliveryFee !== undefined || o.grandTotal !== undefined,
      ) || sortedOrders[0];
    const latestProofOrder =
      [...sortedOrders]
        .filter((o) => Boolean(o.paymentProofImage))
        .sort(
          (a, b) =>
            new Date(
              b.paymentProofUploadedAt || b.updatedAt || b.createdAt || 0,
            ).getTime() -
            new Date(
              a.paymentProofUploadedAt || a.updatedAt || a.createdAt || 0,
            ).getTime(),
        )[0] || null;

    // Calculate subtotal (sum of all items)
    const subtotal = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    // Determine delivery fee (1500 threshold)
    const deliveryFee =
      primaryOrder.deliveryFee !== undefined &&
      primaryOrder.deliveryFee !== null
        ? primaryOrder.deliveryFee
        : subtotal >= 1500
          ? 0
          : 350;

    // Use grandTotal from first item if available, otherwise calculate from subtotal + delivery fee
    const total = primaryOrder.grandTotal || subtotal + deliveryFee;

    const mappedOrder = {
      id: primaryOrder.orderId?.toString() || orderNumber,
      sapSo: orderNumber,
      date: primaryOrder.createdAt || new Date().toLocaleDateString(),
      customer: "",
      items: orders.map((o) => ({
        sku: o.productId?.toString() || "",
        name: "", // Backend doesn't return product name
        qty: o.quantity || 1,
        unitPrice: o.unitPrice || 0,
        total: o.totalPrice || 0,
      })),
      subtotal: subtotal,
      vat: 0,
      total: total,
      status:
        primaryOrder.paymentProofStatus === "rejected"
          ? "REJECTED"
          : mapOrderStatus(primaryOrder.status),
      paymentStatus: "Pending",
      deliveryMethod: primaryOrder.deliveryStatus || "Standard",
      paymentMethod: primaryOrder.paymentMethod || undefined,
      deliveryFee: deliveryFee, // Store delivery fee for display
      paymentProofImage: latestProofOrder?.paymentProofImage
        ? `${process.env.NEXT_PUBLIC_IMAGE_PATH}${latestProofOrder.paymentProofImage}`
        : undefined,
      paymentProofStatus:
        latestProofOrder?.paymentProofStatus ||
        primaryOrder.paymentProofStatus ||
        "pending",
      paymentProofRejectionReason:
        latestProofOrder?.paymentProofRejectionReason ||
        primaryOrder.paymentProofRejectionReason ||
        "",
      paymentProofAttempts:
        latestProofOrder?.paymentProofAttempts ||
        primaryOrder.paymentProofAttempts ||
        0,
    } as any;

    mappedOrders.push(mappedOrder);
  }

  return mappedOrders;
}

/**
 * Map backend status to frontend OrderStatus
 */
function mapOrderStatus(
  status: string,
):
  | "PENDING_APPROVAL"
  | "ACCEPT"
  | "REJECTED"
  | "CANCELLED"
  | "ORDERED_FROM_SUPPLIER"
  | "READY_FOR_BILLING"
  | "AWAITING_PAYMENT_VERIFICATION"
  | "PACKING"
  | "READY_FOR_DELIVERY"
  | "IN_TRANSIT"
  | "PAID"
  | "DELIVERED" {
  const statusMap: Record<string, any> = {
    PENDING_APPROVAL: "PENDING_APPROVAL",
    ACCEPT: "ACCEPT", // Backward compatibility
    REJECTED: "REJECTED",
    CANCELLED: "CANCELLED",
    ORDERED_FROM_SUPPLIER: "ORDERED_FROM_SUPPLIER",
    READY_FOR_BILLING: "READY_FOR_BILLING",
    AWAITING_PAYMENT_VERIFICATION: "AWAITING_PAYMENT_VERIFICATION",
    PACKING: "PACKING",
    READY_FOR_DELIVERY: "READY_FOR_DELIVERY",
    IN_TRANSIT: "IN_TRANSIT",
    PAID: "PAID",
    DELIVERED: "DELIVERED",
  };
  return statusMap[status] || status;
}

/**
 * Hook to fetch and manage orders from NestJS backend
 * Automatically retrieves orders for the current authenticated user
 */
export function useFetchOrders(customerId?: number, isAdmin = false) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedOrders: any[] = [];

        // Use provided customerId or current user's ID
        if (isAdmin) {
          // Admin view - fetch all orders
          fetchedOrders = await fetchAllOrders();
          // ✅ Correct
        } else if (customerId) {
          fetchedOrders = await fetchCustomerOrders(customerId);
        } else if (user?.userId) {
          fetchedOrders = await fetchCustomerOrders(user.userId);
        } else {
          setOrders([]);
          return;
        }

        // Map and group backend orders by orderNumber
        const mappedOrders = groupAndMapOrders(fetchedOrders);
        setOrders(mappedOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId, user?.userId, isAdmin]);

  const refetchOrders = async () => {
    try {
      setLoading(true);
      let fetchedOrders: any[] = [];

      if (isAdmin) {
        fetchedOrders = await fetchAllOrders();
      } else if (customerId) {
        fetchedOrders = await fetchCustomerOrders(customerId);
      } else if (user?.userId) {
        fetchedOrders = await fetchCustomerOrders(user.userId);
      }

      // Map and group backend orders by orderNumber
      const mappedOrders = groupAndMapOrders(fetchedOrders);
      setOrders(mappedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refetch orders");
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    refetchOrders,
  };
}
