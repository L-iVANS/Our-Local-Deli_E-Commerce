import {
  CheckCircle,
  Clock,
  Truck,
  X,
  Package,
} from "lucide-react";
import type { OrderStatus, OrderTabStatus } from "../types/order";

export const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  // Legacy display names (for backward compatibility)
  Open: { color: "#6b7280", bg: "#f9fafb", icon: Package },
  Processing: { color: "#f59e0b", bg: "#fffbeb", icon: Clock },
  Shipped: { color: "#3b82f6", bg: "#eff6ff", icon: Truck },
  Delivered: { color: "#10b981", bg: "#ecfdf5", icon: CheckCircle },
  Cancelled: { color: "#ef4444", bg: "#fef2f2", icon: X },
  Rejected: { color: "#ef4444", bg: "#fef2f2", icon: X },
  

  // Backend enum values
  PENDING_APPROVAL: { color: "#6b7280", bg: "#f9fafb", icon: Package },
  READY_FOR_BILLING: { color: "#6b7280", bg: "#f9fafb", icon: Package },
  ACCEPT: { color: "#16a34a", bg: "#dcfce7", icon: CheckCircle },
  APPROVED: { color: "#f59e0b", bg: "#fffbeb", icon: Clock },
  ORDERED_FROM_SUPPLIER: { color: "#f59e0b", bg: "#fffbeb", icon: Clock },
  AWAITING_PAYMENT_VERIFICATION: { color: "#f59e0b", bg: "#fffbeb", icon: Clock },
  PAID: { color: "#3b82f6", bg: "#eff6ff", icon: Truck },
  DELIVERED: { color: "#10b981", bg: "#ecfdf5", icon: CheckCircle },
  REJECTED: { color: "#ef4444", bg: "#fef2f2", icon: X },
  CANCELLED: { color: "#ef4444", bg: "#fef2f2", icon: X },
};

export const PAY_CONFIG: Record<string, { color: string; bg: string }> = {
  Paid: { color: "#059669", bg: "#ecfdf5" },
  Pending: { color: "#d97706", bg: "#fffbeb" },
  Overdue: { color: "#dc2626", bg: "#fef2f2" },
};

export const STATUS_TABS: OrderTabStatus[] = ["All", "Open", "Processing", "Shipped", "Delivered", "Cancelled", "Rejected"];
