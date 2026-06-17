import { Package } from "lucide-react";
import { CartItem } from "../../types";

interface ItemsSummaryProps {
  items: CartItem[];
  itemCount: number;
}

export function ItemsSummary({ items, itemCount }: ItemsSummaryProps) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        <Package size={12} className="inline mr-1" />
        Selected Items ({itemCount} pcs)
      </div>
      <div className="bg-gray-50 rounded-xl divide-y divide-gray-100 overflow-hidden">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between px-4 py-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={item.product.imageUrl || item.product.image}
                alt={item.product.name}
                className="w-8 h-8 rounded-lg object-cover shrink-0"
              />
              <span className="text-gray-700 line-clamp-1 font-medium">
                {item.product.name.split("—")[0].trim()}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <span className="text-gray-400">×{item.qty}</span>
              <span className="text-gray-900 font-semibold">
                ₱{(item.qty * item.unitPrice).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
