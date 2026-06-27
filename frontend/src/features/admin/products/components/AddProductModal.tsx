"use client";

import { Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useCreateProduct } from "../hooks/service-hooks/use-createproduct";
import { useUpdateProduct } from "../hooks/service-hooks/use-updateproduct";
import { useModal } from "../hooks/useModal";
import { toast } from "sonner";
import { Modal } from "./Modal";
import { FormField } from "./FormField";
import {
  ProductFormData,
  validateProductForm,
  normalizeNumericInput,
  sanitizeSKU,
  sanitizeProductName,
} from "../utils/validation";
import { uploadProductImage } from "../services/imageUpload";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: ProductFormData) => void;
  productToEdit?: ProductFormData & { productId: number };
  categories: { categoryId: number; categoryName: string; skuPrefix: string }[];
}

const INITIAL_FORM_STATE: ProductFormData = {
  name: "",
  sku: "",
  category: "",
  price: 0,
  reorderPoint: 0,
  available: 0,
  productDescription: "",
  image: null,
};

export function AddProductModal({
  isOpen,
  onClose,
  onSubmit,
  productToEdit,
  categories,
}: AddProductModalProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { isAnimating, handleAnimationEnd } = useModal();

  const isEditMode = !!productToEdit;
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && productToEdit) {
        setFormData({
          name: productToEdit.name,
          sku: productToEdit.sku,
          category: productToEdit.category,
          price: productToEdit.price,
          reorderPoint: productToEdit.reorderPoint,
          available: productToEdit.available,
          productDescription: (productToEdit as any).productDescription || "",
          image: null,
        });
      } else {
        setFormData(INITIAL_FORM_STATE);
      }
      setImagePreview(null);
      setErrors({});
      setError(null);
    }
  }, [isOpen, isEditMode, productToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let finalValue: any = value;

    switch (name) {
      case "name":
        finalValue = sanitizeProductName(value);
        break;
      case "sku":
        finalValue = sanitizeSKU(value);
        break;
      case "category": {
        finalValue = value;
        const selectedCategory = categories.find(
          (cat) => cat.categoryName === value
        );
        if (selectedCategory && selectedCategory.skuPrefix) {
          setFormData((prev) => ({
            ...prev,
            category: finalValue,
            sku: selectedCategory.skuPrefix,
          }));
          if (errors.category || errors.sku) {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.category;
              delete newErrors.sku;
              return newErrors;
            });
          }
          return;
        }
        break;
      }
      case "price":
      case "reorderPoint":
      case "available":
        finalValue = normalizeNumericInput(value);
        break;
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Please select an image file" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB" }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const field = (e.target as HTMLInputElement).name;
    if (
      (field === "price" || field === "reorderPoint" || field === "available") &&
      e.key === "-"
    ) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateProductForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selectedCategory = categories.find(
        (cat) => cat.categoryName === formData.category
      );
      const categoryId = selectedCategory?.categoryId ?? 0;

      let imageUrl = formData.imageUrl || "";
      if (formData.image) {
        toast.loading("Uploading image...");
        try {
          imageUrl = await uploadProductImage(formData.image);
          toast.dismiss();
        } catch {
          toast.error("Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }
      }

      if (isEditMode && productToEdit) {
        await updateProduct.mutateAsync({
          id: productToEdit.productId,
          input: {
            productName: formData.name,
            productDescription: formData.productDescription,
            sku: formData.sku,
            categoryId,
            productPrice: formData.price,
            reorderPoint: formData.reorderPoint,
            available: formData.available,
            ...(imageUrl && { imageUrl }),
          },
        });
        toast.success("Product updated successfully!");
      } else {
        await createProduct.mutateAsync({
          productName: formData.name,
          productDescription: formData.productDescription,
          sku: formData.sku,
          categoryId,
          productPrice: formData.price,
          reorderPoint: formData.reorderPoint,
          available: formData.available,
          ...(imageUrl && { imageUrl }),
        });
        toast.success("Product created successfully!");
      }

      onSubmit(formData);
      handleClose();
    } catch (err: any) {
      setError(err);
      toast.error(
        isEditMode ? "Failed to update product." : "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_STATE);
    setImagePreview(null);
    setErrors({});
    setError(null);
    onClose();
  };

  if (!isOpen && !isAnimating) return null;

  const categoryOptions = categories.map((cat) => ({
    value: cat.categoryName,
    label: cat.categoryName,
  }));

  return (
    <Modal
      isOpen={isOpen}
      isAnimating={isAnimating}
      onClose={handleClose}
      onAnimationEnd={() => handleAnimationEnd(isOpen)}
      title={isEditMode ? "Edit Product" : "Add New Product"}
      subtitle={
        isEditMode
          ? "Update the product details below"
          : "Fill in the product details below"
      }
      icon={<Package size={20} className="text-primary" />}
      headerBg="rgba(10, 58, 43, 0.06)"  // ✅ soft green tint (same idea as the pink)
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Mutation Error */}
        {error && (
          <div className="p-3 rounded-lg border border-red-300 bg-red-50 dark:border-red-700/40 dark:bg-red-950/30">
            <p className="text-sm text-red-700 dark:text-red-300">
              {error.message}
            </p>
          </div>
        )}

        {/* Product Name */}
        <FormField
          label="Product Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g., Elite Vacuum Flask 500ml"
          required
          showCharCount
          maxChars={100}
          maxLength={100}
        />

        {/* SKU + Category */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="SKU"
            name="sku"
            type="text"
            value={formData.sku}
            onChange={handleChange}
            error={errors.sku}
            placeholder="e.g., OHW-VF-001"
            required
            showCharCount
            maxChars={20}
            maxLength={20}
          />

          <FormField
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            options={categoryOptions}
            required
          />
        </div>

        {/* Price + Reorder */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Price (₱)"
            name="price"
            type="number"
            value={formData.price || ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            error={errors.price}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />

          <FormField
            label="Reorder Point"
            name="reorderPoint"
            type="number"
            value={formData.reorderPoint || ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            error={errors.reorderPoint}
            placeholder="100"
            min="0"
            required
          />
        </div>

        {/* Available Units */}
        <FormField
          label="Available Units"
          name="available"
          type="number"
          value={formData.available || ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          error={errors.available}
          placeholder="0"
          min="0"
          required
        />

        {/* Product Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="productDescription"
              className="block text-sm font-semibold text-gray-800 dark:text-gold"
            >
              Product Description *
            </label>
            <span className="text-xs text-gray-400 dark:text-muted-foreground">
              {formData.productDescription.length}/500
            </span>
          </div>
          <textarea
            id="productDescription"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            placeholder="e.g., A premium vacuum flask with double-wall insulation..."
            maxLength={500}
            rows={4}
            className={[
              "w-full px-4 py-2.5 rounded-lg border text-sm resize-none transition-all",
              "bg-gray-50 dark:bg-input-background",
              "text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground/70",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              errors.productDescription
                ? "border-red-400 dark:border-red-500/60"
                : "border-gray-200 dark:border-sidebar-border",
            ].join(" ")}
          />
          {errors.productDescription && (
            <p className="text-xs mt-1 text-red-500">
              {errors.productDescription}
            </p>
          )}
        </div>

        {/* Product Image */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gold"
          >
            Product Image
          </label>
          <div className="flex gap-4">
            {/* Preview */}
            <div
              className={[
                "w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden",
                "bg-gray-50 dark:bg-input-background",
                errors.image
                  ? "border-red-400"
                  : "border-gray-200 dark:border-sidebar-border",
              ].join(" ")}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <p className="text-xs text-gray-400 dark:text-muted-foreground">
                  Upload image
                </p>
              )}
            </div>

            {/* Upload */}
            <div className="flex-1">
              <input
                id="image"
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <label
                htmlFor="image"
                className={[
                  "block w-full px-4 py-2.5 rounded-lg border-2 border-dashed text-sm font-semibold text-center cursor-pointer transition-colors",
                  "bg-gray-50 dark:bg-input-background text-gray-800 dark:text-gold",
                  "hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10",
                  errors.image
                    ? "border-red-400"
                    : "border-gray-200 dark:border-sidebar-border",
                ].join(" ")}
              >
                Click to upload image
              </label>
              <p className="text-xs mt-2 text-gray-400 dark:text-muted-foreground">
                JPG, PNG, or WebP (Max 5MB)
              </p>
              {errors.image && (
                <p className="text-xs mt-2 text-red-500">{errors.image}</p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-sidebar-border pt-6" />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-semibold border transition-colors
                       border-gray-200 dark:border-sidebar-border
                       text-gray-800 dark:text-gold
                       bg-transparent hover:bg-gray-50 dark:hover:bg-sidebar-accent
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm transition-all
                       bg-primary text-[#F4F4F0]
                       hover:bg-primary/90 hover:shadow-md
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#F4F4F0] border-t-transparent rounded-full animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Package size={16} />
                {isEditMode ? "Update Product" : "Add Product"}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}