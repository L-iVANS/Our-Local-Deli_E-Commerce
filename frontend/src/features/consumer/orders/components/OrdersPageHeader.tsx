import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface OrdersPageHeaderProps {
  ordersCount: number;
}

export function OrdersPageHeader({ ordersCount }: OrdersPageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/home" className="hover:text-red-600">Home</Link>
            <ChevronDown size={10} className="-rotate-90" />
            <span className="text-gray-600">Orders</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            My Orders
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">{ordersCount} orders</p>
        </div>
      </div>
    </div>
  );
}
