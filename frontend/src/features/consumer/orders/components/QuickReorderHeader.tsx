"use client";

import { RefreshCw } from "lucide-react";

interface QuickReorderHeaderProps {
  onRefresh?: () => void;
}

export function QuickReorderHeader({ onRefresh }: QuickReorderHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
      <div>
        <h2 className="font-semibold text-gray-800 text-sm">Quick Reorder</h2>
        <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.72rem" }}>
          Your most-ordered items
        </p>
      </div>
      <button
        onClick={onRefresh}
        className="hover:opacity-70 cursor-pointer transition-opacity"
        aria-label="Refresh quick reorder items"
      >
        <RefreshCw size={14} style={{ color: "#9ca3af" }} />
      </button>
    </div>
  );
}
