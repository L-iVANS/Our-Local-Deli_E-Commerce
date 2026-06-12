'use client';

import { X, Package, Tag, Layers } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductDetailsModalProps {
  isOpen: boolean;
  product: {
    id: string;
    name: string;
    sku: string;
    category: string;
    categoryId: number;
    available: number;
    inTransit: number;
    blocked: number;
    reorderPoint: number;
    price: number;
    status: string;
  };
  onClose: () => void;
}

export function ProductDetailsModal({
  isOpen,
  product,
  onClose,
}: ProductDetailsModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const totalStock = product.available + product.inTransit + product.blocked;
  const stockPercentage = product.reorderPoint > 0 ? (product.available / product.reorderPoint) * 100 : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed top-0 left-0 w-screen h-screen z-40"
        style={{
          background: "rgba(0,0,0,0.5)",
          animation: isOpen
            ? "fadeIn 0.2s ease-out"
            : "fadeOut 0.2s ease-out forwards",
        }}
        onClick={onClose}
        onAnimationEnd={() => {
          if (!isOpen) setIsAnimating(false);
        }}
      />

      {/* Dialog */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 pointer-events-none" style={{ maxHeight: "100vh", maxWidth: "100vw" }}>
        <div
          className="rounded-2xl overflow-hidden w-full max-w-2xl pointer-events-auto"
          style={{
            background: "white",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            animation: isOpen
              ? "slideUp 0.3s ease-out"
              : "slideDown 0.2s ease-out forwards",
          }}
          onAnimationEnd={() => {
            if (!isOpen) setIsAnimating(false);
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes slideDown {
              from {
                opacity: 1;
                transform: translateY(0);
              }
              to {
                opacity: 0;
                transform: translateY(20px);
              }
            }
          `}</style>

          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
              Product Details
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={18} color="#64748b" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Product Header */}
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#fdf2f2" }}
              >
                <Package size={28} style={{ color: "#bf262f" }} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }} className="truncate">
                  {product.name}
                </h2>
                <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                  SKU: <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{product.sku}</span>
                </p>
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-4 pb-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }} className="font-semibold">
                  Category
                </p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                  {product.category}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }} className="font-semibold">
                  Price
                </p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                  ₱{product.price.toLocaleString()}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }} className="font-semibold">
                  Status
                </p>
                <span
                  className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: "#ecfdf5",
                    color: "#16a34a",
                    border: "1px solid #16a34a30",
                  }}
                >
                  {product.status}
                </span>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }} className="font-semibold">
                  Reorder Point
                </p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                  {product.reorderPoint} units
                </p>
              </div>
            </div>

            {/* Stock Levels */}
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
                Stock Levels
              </h3>
              <div className="space-y-3">
                {/* Available */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563" }}>Available</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#16a34a" }}>
                      {product.available} units
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#f1f5f9" }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(stockPercentage, 100)}%`,
                        backgroundColor: "#16a34a",
                      }}
                    />
                  </div>
                </div>

                {/* In Transit */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563" }}>In Transit</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#f59e0b" }}>
                      {product.inTransit} units
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#f1f5f9" }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(product.inTransit / totalStock) * 100 || 0}%`,
                        backgroundColor: "#f59e0b",
                      }}
                    />
                  </div>
                </div>

                {/* Blocked */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563" }}>Blocked</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#ef4444" }}>
                      {product.blocked} units
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#f1f5f9" }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(product.blocked / totalStock) * 100 || 0}%`,
                        backgroundColor: "#ef4444",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Total Stock */}
              <div
                className="mt-4 p-3 rounded-lg"
                style={{
                  backgroundColor: "#eff6ff",
                  borderLeft: "3px solid #2563eb",
                }}
              >
                <p style={{ fontSize: "13px", color: "#4b5563" }}>
                  Total Stock: <strong style={{ color: "#2563eb", fontSize: "15px" }}>
                    {totalStock} units
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4" style={{ borderTop: "1px solid #f1f5f9" }}>
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: "#bf262f" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
