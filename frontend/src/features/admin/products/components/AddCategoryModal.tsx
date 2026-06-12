'use client';

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: CategoryFormData) => void;
  categoryToEdit?: CategoryFormData & { categoryId: number };
  isLoading?: boolean;
}

export interface CategoryFormData {
  categoryName: string;
  slug: string;
  skuPrefix: string;
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  categoryToEdit,
  isLoading = false,
}: AddCategoryModalProps) {
  const isEditMode = !!categoryToEdit;
  const [isAnimating, setIsAnimating] = useState(false);

  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: "",
    slug: "",
    skuPrefix: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isEditMode && categoryToEdit) {
      setFormData({
        categoryName: categoryToEdit.categoryName,
        slug: categoryToEdit.slug,
        skuPrefix: categoryToEdit.skuPrefix,
      });
    } else {
      setFormData({
        categoryName: "",
        slug: "",
        skuPrefix: "",
      });
    }
    setErrors({});
  }, [isOpen, isEditMode, categoryToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Trim leading/trailing spaces for categoryName
    if (name === "categoryName") {
      finalValue = value.slice(0, 100);
    }

    // Slug: lowercase, hyphens, no spaces
    if (name === "slug") {
      finalValue = value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 50);
    }

    // SKU Prefix: uppercase, alphanumeric only
    if (name === "skuPrefix") {
      finalValue = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }
    if (!formData.skuPrefix.trim()) {
      newErrors.skuPrefix = "SKU prefix is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  if (!isOpen && !isAnimating) return null;

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
          className="rounded-2xl overflow-hidden w-full max-w-md pointer-events-auto"
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
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideDown {
              from { opacity: 1; transform: translateY(0); }
              to { opacity: 0; transform: translateY(20px); }
            }
          `}</style>

          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #f1f5f9" }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
              {isEditMode ? "Edit Category" : "Add Category"}
            </h3>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              <X size={18} color="#64748b" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
            {/* Category Name */}
            <div>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#4b5563",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Category Name
              </label>
              <input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-all"
                style={{
                  borderColor: errors.categoryName ? "#dc2626" : "#e2e8f0",
                  backgroundColor: "#f8fafc",
                }}
                placeholder="e.g., Cookware"
              />
              {errors.categoryName && (
                <p style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px" }}>
                  {errors.categoryName}
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#4b5563",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-all"
                style={{
                  borderColor: errors.slug ? "#dc2626" : "#e2e8f0",
                  backgroundColor: "#f8fafc",
                }}
                placeholder="e.g., cookware"
              />
              {errors.slug && (
                <p style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px" }}>
                  {errors.slug}
                </p>
              )}
            </div>

            {/* SKU Prefix */}
            <div>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#4b5563",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                SKU Prefix
              </label>
              <input
                type="text"
                name="skuPrefix"
                value={formData.skuPrefix}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-all"
                style={{
                  borderColor: errors.skuPrefix ? "#dc2626" : "#e2e8f0",
                  backgroundColor: "#f8fafc",
                }}
                placeholder="e.g., CW"
              />
              {errors.skuPrefix && (
                <p style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px" }}>
                  {errors.skuPrefix}
                </p>
              )}
            </div>
            </div>

            {/* Footer - Buttons inside form */}
            <div
              className="px-6 py-4 flex items-center justify-end gap-3"
              style={{ borderTop: "1px solid #f1f5f9" }}
            >
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
                style={{
                  borderColor: "#e2e8f0",
                  color: "#4b5563",
                  backgroundColor: "#f8fafc",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
                style={{
                  backgroundColor: "#bf262f",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.8 : 1,
                }}
              >
                {isLoading ? "Saving..." : isEditMode ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
