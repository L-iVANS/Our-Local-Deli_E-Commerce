import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { RED, RED_LIGHT } from "../../../../data/constants";

interface PageHeaderProps {
  activeCategory: string;
  filteredCount: number;
}

export function PageHeader({ activeCategory, filteredCount }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/b2b/home" className="hover:text-red-600">Home</Link>
            <ChevronDown size={10} className="-rotate-90" />
            <span className="text-gray-600">Products</span>
            {activeCategory !== "All" && (
              <>
                <ChevronDown size={10} className="-rotate-90" />
                <span className="text-gray-600">{activeCategory}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold " style={{ fontFamily: "'Playfair Display', serif" }}>
            {activeCategory === "All" ? "Full Catalog" : activeCategory}
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">{filteredCount} products</p>
        </div>
      </div>
    </div>
  );
}