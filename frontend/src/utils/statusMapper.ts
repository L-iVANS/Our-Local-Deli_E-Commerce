// Map database status values to display labels
const statusLabels: Record<string, string> = {
  PENDING_APPROVAL: "Upload payment proof",
  ACCEPT: "Accepted",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  PACKING: "Packing",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  PAID: "Paid",
  UNPAID: "Unpaid",
  OVERDUE: "Overdue",
  PARTIALLY_PAID: "Partially Paid",
  OPEN: "Open",
  READY_FOR_BILLING: "Ready for Billing",
  AWAITING_PAYMENT_VERIFICATION: "Waiting for Payment Verification",
  READY_FOR_DELIVERY: "Ready for Delivery",
  ORDERED_FROM_SUPPLIER: "Ordered from Supplier",
}

export function getStatusLabel(status: string): string {
  return statusLabels[status] || status;
}

// Get status color for badge display
export function getStatusColor(status: string): { bg: string; border: string; text: string } {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    PENDING_APPROVAL: {
      bg: "#fef3c7",
      border: "#fde68a",
      text: "#d97706",
    },
    ACCEPT: {
      bg: "#dcfce7",
      border: "#bbf7d0",
      text: "#16a34a",
    },
    APPROVED: {
      bg: "#dcfce7",
      border: "#bbf7d0",
      text: "#16a34a",
    },
    REJECTED: {
      bg: "#fee2e2",
      border: "#fecaca",
      text: "#dc2626",
    },
    CANCELLED: {
      bg: "#fee2e2",
      border: "#fecaca",
      text: "#dc2626",
    },
    PACKING: {
      bg: "#faf5ff",
      border: "#f3e8ff",
      text: "#9333ea",
    },
    IN_TRANSIT: {
      bg: "#fef3c7",
      border: "#fde68a",
      text: "#ca8a04",
    },
    DELIVERED: {
      bg: "#dcfce7",
      border: "#bbf7d0",
      text: "#16a34a",
    },
    PAID: {
      bg: "#dcfce7",
      border: "#bbf7d0",
      text: "#16a34a",
    },
    READY_FOR_BILLING: {
      bg: "#fef08a",
      border: "#fde047",
      text: "#ca8a04",
    },
    AWAITING_PAYMENT_VERIFICATION: {
      bg: "#e0e7ff",
      border: "#c7d2fe",
      text: "#4f46e5",
    },
    READY_FOR_DELIVERY: {
      bg: "#fbf8f3",
      border: "#f5f3ff",
      text: "#78350f",
    },
    ORDERED_FROM_SUPPLIER: {
      bg: "#f0f9ff",
      border: "#e0f2fe",
      text: "#0369a1",
    },
  };

  return colors[status] || colors.PENDING_APPROVAL;
}
