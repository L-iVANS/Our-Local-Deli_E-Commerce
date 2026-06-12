'use client';

import { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";

export interface Category {
  categoryId: number;
  categoryName: string;
  slug: string;
  skuPrefix: string;
}

interface CategoriesTableProps {
  categories: Category[];
  emptyMessage?: string;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

function ActionsMenu({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonPosition({
      top: rect.bottom + 8,
      left: rect.left - 160,
    });
    setIsOpen(!isOpen);
  };

  const actions = [
    { label: "Edit", icon: Edit2, onClick: () => { onEdit?.(category); setIsOpen(false); } },
    { label: "Delete", icon: Trash2, onClick: () => { onDelete?.(category); setIsOpen(false); }, color: "#dc2626" },
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
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="fixed w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
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
                <action.icon size={14} style={{ color: action.color || "#475569" }} />
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function CategoriesTable({
  categories,
  emptyMessage = "No categories found",
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div
        className="w-full rounded-xl border border-gray-200 p-8 text-center"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <p style={{ color: "#64748b", fontSize: "14px" }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-xl border border-gray-200 overflow-hidden"
      style={{ backgroundColor: "white" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th
                className="px-6 py-3 text-left font-semibold"
                style={{ color: "#64748b", fontSize: "12px" }}
              >
                Name
              </th>
              <th
                className="px-6 py-3 text-left font-semibold"
                style={{ color: "#64748b", fontSize: "12px" }}
              >
                Slug
              </th>
              <th
                className="px-6 py-3 text-left font-semibold"
                style={{ color: "#64748b", fontSize: "12px" }}
              >
                SKU Prefix
              </th>
              <th
                className="px-6 py-3 text-center font-semibold"
                style={{ color: "#64748b", fontSize: "12px" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr
                key={category.categoryId}
                style={{
                  borderBottom: index !== categories.length - 1 ? "1px solid #e2e8f0" : "none",
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td
                  className="px-6 py-4 font-medium"
                  style={{ color: "#0f172a" }}
                >
                  {category.categoryName}
                </td>
                <td className="px-6 py-4" style={{ color: "#64748b" }}>
                  {category.slug}
                </td>
                <td className="px-6 py-4" style={{ color: "#64748b" }}>
                  {category.skuPrefix}
                </td>
                <td className="px-6 py-4 text-center">
                  <ActionsMenu
                    category={category}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
