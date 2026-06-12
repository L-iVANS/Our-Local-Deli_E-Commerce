export const STATUS_FLOW: Record<string, string[]> = {
  PENDING_APPROVAL: ["AWAITING_PAYMENT_VERIFICATION", "REJECTED", "CANCELLED"],
  AWAITING_PAYMENT_VERIFICATION: ["ACCEPT", "REJECTED", "CANCELLED"],
  ACCEPT: ["PACKING", "REJECTED", "CANCELLED"],
  PACKING: ["IN_TRANSIT", "REJECTED", "CANCELLED"],
  IN_TRANSIT: ["DELIVERED", "REJECTED", "CANCELLED"],
  DELIVERED: ["CANCELLED"],
  REJECTED: [],
  CANCELLED: [],
  ORDERED_FROM_SUPPLIER: ["READY_FOR_DELIVERY", "REJECTED", "CANCELLED"],
  READY_FOR_DELIVERY: ["PACKING", "REJECTED", "CANCELLED"],
  READY_FOR_BILLING: ["PAID", "REJECTED", "CANCELLED"],
  PAID: ["DELIVERED", "CANCELLED"],
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING_APPROVAL: "Pending Approval",
  AWAITING_PAYMENT_VERIFICATION: "Awaiting Payment Verification",
  ACCEPT: "Accept",
  PACKING: "Packing",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  ORDERED_FROM_SUPPLIER: "Ordered from Supplier",
  READY_FOR_DELIVERY: "Ready for Delivery",
  READY_FOR_BILLING: "Ready for Billing",
  PAID: "Paid",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

export const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING_APPROVAL: { bg: "#fffbeb", color: "#d97706" },
  AWAITING_PAYMENT_VERIFICATION: { bg: "#e0e7ff", color: "#4f46e5" },
  ACCEPT: { bg: "#dcfce7", color: "#16a34a" },
  PACKING: { bg: "#faf5ff", color: "#9333ea" },
  IN_TRANSIT: { bg: "#fef3c7", color: "#ca8a04" },
  DELIVERED: { bg: "#ecfdf5", color: "#16a34a" },
  ORDERED_FROM_SUPPLIER: { bg: "#f0f9ff", color: "#0369a1" },
  READY_FOR_DELIVERY: { bg: "#fbf8f3", color: "#78350f" },
  READY_FOR_BILLING: { bg: "#fef08a", color: "#ca8a04" },
  PAID: { bg: "#dcfce7", color: "#16a34a" },
  REJECTED: { bg: "#fee2e2", color: "#dc2626" },
  CANCELLED: { bg: "#f3f4f6", color: "#6b7280" },
};
