import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BLUE = "#3b82f6";

export function OrderSuccessActions() {
  return (
    <div className="flex gap-3">
      <Link
        href="/b2b/home"
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Home
      </Link>
      <Link
        href="/b2b/products"
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        style={{ backgroundColor: BLUE }}
      >
        Order More <ArrowRight size={14} />
      </Link>
    </div>
  );
}
