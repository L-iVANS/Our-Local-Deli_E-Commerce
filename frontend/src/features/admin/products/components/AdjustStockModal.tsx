'use client';

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useUpdateProduct } from "@/features/admin/products/hooks/service-hooks/use-updateproduct";
import { toast } from "sonner";

interface AdjustStockModalProps {
  isOpen: boolean;
  product: {
    id: string;
    name: string;
    sku: string;
    category: string;
    categoryId: number;
    price: number;
    reorderPoint: number;
    available: number;
    inTransit: number;
    blocked: number;
  };
  onClose: () => void;
  onSubmit?: (data: { available: number; inTransit: number; blocked: number }) => void;
  isLoading?: boolean;
}

export function AdjustStockModal({
  isOpen,
  product,
  onClose,
  onSubmit,
  isLoading = false,
}: AdjustStockModalProps) {
  const [updateProduct] = useUpdateProduct();
  const [available, setAvailable] = useState(product.available.toString());
  const [inTransit, setInTransit] = useState(product.inTransit.toString());
  const [blocked, setBlocked] = useState(product.blocked.toString());
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update state when product changes
  useEffect(() => {
    setAvailable(product.available.toString());
    setInTransit(product.inTransit.toString());
    setBlocked(product.blocked.toString());
  }, [product.id, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleSubmit = () => {
    const data = {
      available: parseInt(available) || 0,
      inTransit: parseInt(inTransit) || 0,
      blocked: parseInt(blocked) || 0,
    };

    setLoading(true);

    const productId = parseInt(product.id);

    updateProduct({
      variables: {
        id: productId,
        input: {
          productName: product.name,
          productDescription: "",
          sku: product.sku,
          categoryId: product.categoryId,
          productPrice: product.price,
          reorderPoint: product.reorderPoint,
          available: data.available,
          inTransit: data.inTransit,
          blocked: data.blocked,
        },
      },
    })
      .then(() => {
        onSubmit?.(data);
        toast.success("Stock levels updated successfully!");
        onClose();
      })
      .catch((err) => {
        toast.error("Failed to update stock levels.");
        console.error("❌ Mutation error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
      <div
        className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        style={{ maxHeight: "100vh", maxWidth: "100vw" }}
      >
        <div
          className="rounded-2xl overflow-hidden w-full max-w-sm pointer-events-auto"
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
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes fadeOut {
              from {
                opacity: 1;
              }
              to {
                opacity: 0;
              }
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
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
            Adjust Stock Levels
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            <X size={18} color="#64748b" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }} className="font-semibold">
              Product: <span style={{ color: "#0f172a" }}>{product.name}</span>
            </p>
          </div>

          {/* Available Quantity */}
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
              Available Quantity
            </label>
            <input
              type="number"
              value={available}
              onChange={(e) => setAvailable(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-all"
              style={{
                borderColor: "#e2e8f0",
                backgroundColor: "#f8fafc",
              }}
            />
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>Current: {product.available} units</p>
          </div>

          {/* In Transit */}
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
              In Transit
            </label>
            <input
              type="number"
              value={inTransit}
              onChange={(e) => setInTransit(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-all"
              style={{
                borderColor: "#e2e8f0",
                backgroundColor: "#f8fafc",
              }}
            />
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>Current: {product.inTransit} units</p>
          </div>

          {/* Blocked */}
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
              Blocked / Reserved
            </label>
            <input
              type="number"
              value={blocked}
              onChange={(e) => setBlocked(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-all"
              style={{
                borderColor: "#e2e8f0",
                backgroundColor: "#f8fafc",
              }}
            />
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>Current: {product.blocked} units</p>
          </div>

          {/* Total */}
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: "#f0fdf4",
              borderLeft: "3px solid #16a34a",
            }}
          >
            <p style={{ fontSize: "12px", color: "#4b5563" }}>
              Total Stock: <strong style={{ color: "#16a34a", fontSize: "14px" }}>
                {(parseInt(available) || 0) + (parseInt(inTransit) || 0) + (parseInt(blocked) || 0)} units
              </strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid #f1f5f9" }}>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
            style={{
              borderColor: "#e2e8f0",
              color: "#4b5563",
              backgroundColor: "#f8fafc",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style={{
              backgroundColor: "#bf262f",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "Updating..." : "Update Stock"}
          </button>
        </div>
        </div>
      </div>
    </>
  );
}
