'use client';

import { useState } from "react";
import { MoreVertical, Edit2, Eye, Package, Archive } from "lucide-react";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  categoryId: number;
  available: number;
  inTransit: number;
  blocked: number;
  reorderPoint: number;
  status: string;
  price: number;
}

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, { bg: string; text: string; color: string }> = {
    Active: { bg: "#ecfdf5", text: "#059669", color: "#16a34a" },
    "Low Stock": { bg: "#fffbeb", text: "#d97706", color: "#f59e0b" },
    "Out of Stock": { bg: "#fef2f2", text: "#dc2626", color: "#ef4444" },
  };

  const style = statusColors[status] || statusColors["Active"];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.color}30`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.color }} />
      {status}
    </span>
  );
}

function ActionsMenu({
  product,
  onEdit,
  onViewDetails,
}: {
  product: Product;
  onEdit?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  
  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonPosition({
      top: rect.bottom + 8,
      left: rect.left - 200,
    });
    setIsOpen(!isOpen);
  };

  const actions = [
    { label: "Edit", icon: Edit2, onClick: () => { onEdit?.(product); setIsOpen(false); } },
    { label: "View Details", icon: Eye, onClick: () => { onViewDetails?.(product); setIsOpen(false); } },
  ];

  return (
    <div>
      <button
        onClick={handleMenuOpen}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        title="More options"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu - Fixed positioning to viewport */}
          <div
            className="fixed w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
            style={{
              top: buttonPosition.top,
              left: buttonPosition.left,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
          >
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors hover:bg-gray-50 text-gray-700"
              >
                <action.icon size={14} />
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface ProductsTableProps {
  products: Product[];
  emptyMessage?: string;
  onEdit?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  onAdjustStock?: (product: Product) => void;
  onArchive?: (product: Product) => void;
}

export function ProductsTable({
  products,
  emptyMessage = "No products found",
  onEdit,
  onViewDetails,
  onAdjustStock,
  onArchive,
}: ProductsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm" style={{ minWidth: "100%" }}>
          <thead>
            <tr
              className="border-b border-gray-100"
              style={{ backgroundColor: "#fafafa" }}
            >
              {[
                "Product",
                "SKU",
                "Category",
                "Available",
                "In Transit",
                "Blocked",
                "Reorder Pt.",
                "Price",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-600 whitespace-nowrap">
                    {product.sku}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {product.category}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          product.available <= product.reorderPoint
                            ? "#dc2626"
                            : "#16a34a",
                      }}
                    >
                      {product.available}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-amber-600 font-medium whitespace-nowrap">
                    {product.inTransit}
                  </td>
                  <td className="px-5 py-3.5 text-red-600 font-medium whitespace-nowrap">
                    {product.blocked}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">
                    {product.reorderPoint}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800 whitespace-nowrap">
                    ₱{product.price.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      {/* Adjust Stock Button */}
                      <button
                        onClick={() => onAdjustStock?.(product)}
                        className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-600"
                        title="Adjust Stock"
                      >
                        <Package size={16} />
                      </button>

                      {/* Archive Button */}
                      <button
                        onClick={() => onArchive?.(product)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600"
                        title="Archive"
                      >
                        <Archive size={16} />
                      </button>

                      {/* More Options Dropdown */}
                      <ActionsMenu
                        product={product}
                        onEdit={onEdit}
                        onViewDetails={onViewDetails}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-8 text-center text-sm text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderTop: "1px solid #f1f5f9", background: "#fafafa" }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
            style={{
              borderColor: currentPage === 1 ? "#e5e7eb" : "#d1d5db",
              color: currentPage === 1 ? "#d1d5db" : "#6b7280",
              backgroundColor: currentPage === 1 ? "#f3f4f6" : "white",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            ← Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                style={{
                  backgroundColor: currentPage === page ? "#bf262f" : "#f3f4f6",
                  color: currentPage === page ? "white" : "#6b7280",
                  border: currentPage === page ? "1px solid #bf262f" : "1px solid #e5e7eb",
                  cursor: "pointer",
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
            style={{
              borderColor: currentPage === totalPages ? "#e5e7eb" : "#d1d5db",
              color: currentPage === totalPages ? "#d1d5db" : "#6b7280",
              backgroundColor: currentPage === totalPages ? "#f3f4f6" : "white",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next →
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#6b7280" }}>
          Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} products
        </p>
      </div>
    </div>
  );
}
