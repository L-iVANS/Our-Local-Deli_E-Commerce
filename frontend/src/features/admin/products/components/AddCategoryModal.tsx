'use client';

import { X, Tag } from "lucide-react";
import { useState, useEffect } from "react";

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
    if (isOpen) setIsAnimating(true);
  }, [isOpen]);

  useEffect(() => {
    if (isEditMode && categoryToEdit) {
      setFormData({
        categoryName: categoryToEdit.categoryName,
        slug: categoryToEdit.slug,
        skuPrefix: categoryToEdit.skuPrefix,
      });
    } else {
      setFormData({ categoryName: "", slug: "", skuPrefix: "" });
    }
    setErrors({});
  }, [isOpen, isEditMode, categoryToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "categoryName") {
      finalValue = value.slice(0, 100);
    }
    if (name === "slug") {
      finalValue = value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 50);
    }
    if (name === "skuPrefix") {
      finalValue = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

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
    if (!formData.categoryName.trim()) newErrors.categoryName = "Category name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.skuPrefix.trim()) newErrors.skuPrefix = "SKU prefix is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  if (!isOpen && !isAnimating) return null;

  // ✨ shared input class — clean default, green focus
  const inputClass = (hasError?: string) =>
    [
      "w-full px-3 py-2.5 rounded-lg border text-sm transition-all",
      "bg-gray-50 dark:bg-input-background",
      "text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground/70",
      "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
      hasError
        ? "border-red-400 dark:border-red-500/60"
        : "border-gray-200 dark:border-sidebar-border",
      "disabled:opacity-60 disabled:cursor-not-allowed",
    ].join(" ");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed top-0 left-0 w-screen h-screen z-40 bg-black/50"
        style={{
          animation: isOpen
            ? "fadeIn 0.2s ease-out"
            : "fadeOut 0.2s ease-out forwards",
        }}
        onClick={onClose}
        onAnimationEnd={() => { if (!isOpen) setIsAnimating(false); }}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="rounded-2xl overflow-hidden w-full max-w-md pointer-events-auto
                     bg-white dark:bg-card
                     border border-gray-200 dark:border-sidebar-border
                     shadow-2xl"
          style={{
            animation: isOpen
              ? "slideUp 0.3s ease-out"
              : "slideDown 0.2s ease-out forwards",
          }}
          onAnimationEnd={() => { if (!isOpen) setIsAnimating(false); }}
        >
          <style>{`
            @keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 } }
            @keyframes fadeOut  { from { opacity: 1 } to { opacity: 0 } }
            @keyframes slideUp  { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
            @keyframes slideDown{ from { opacity: 1; transform: translateY(0)   } to { opacity: 0; transform: translateY(20px) } }
          `}</style>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4
                          border-b border-gray-200 dark:border-sidebar-border
                          ">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center
                              bg-white dark:bg-card
                              border border-gray-200 dark:border-sidebar-border shadow-sm">
                <Tag size={18} className="text-primary" />
              </div>
              <h3 className="font-serif text-base font-semibold text-primary dark:text-gold-light">
                {isEditMode ? "Edit Category" : "Add Category"}
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              aria-label="Close"
              className="p-1.5 rounded-lg transition-colors
                         text-gray-500 hover:text-gray-800 hover:bg-gray-200
                         dark:text-muted-foreground dark:hover:text-gold dark:hover:bg-sidebar-accent
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gold">
                  Category Name
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="e.g., Cookware"
                  className={inputClass(errors.categoryName)}
                />
                {errors.categoryName && (
                  <p className="text-[11px] mt-1 text-red-500">{errors.categoryName}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gold">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="e.g., cookware"
                  className={inputClass(errors.slug)}
                />
                {errors.slug && (
                  <p className="text-[11px] mt-1 text-red-500">{errors.slug}</p>
                )}
              </div>

              {/* SKU Prefix */}
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gold">
                  SKU Prefix
                </label>
                <input
                  type="text"
                  name="skuPrefix"
                  value={formData.skuPrefix}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="e.g., CW"
                  className={inputClass(errors.skuPrefix)}
                />
                {errors.skuPrefix && (
                  <p className="text-[11px] mt-1 text-red-500">{errors.skuPrefix}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex items-center justify-end gap-3
                            border-t border-gray-200 dark:border-sidebar-border">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors
                           border-gray-200 dark:border-sidebar-border
                           bg-gray-50 dark:bg-card
                           text-gray-700 dark:text-gold
                           hover:bg-gray-100 dark:hover:bg-sidebar-accent
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all
                           bg-primary text-[#F4F4F0]
                           hover:bg-primary/90 hover:shadow-md
                           focus:outline-none focus:ring-2 focus:ring-primary/30
                           active:scale-[0.98]
                           disabled:opacity-70 disabled:cursor-not-allowed"
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