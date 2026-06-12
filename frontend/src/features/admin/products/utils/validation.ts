export interface ValidationErrors {
  [key: string]: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  price: number;
  reorderPoint: number;
  available: number;
  productDescription: string;
  image: File | null;
  imageUrl?: string;
}

/**
 * Validates product form data
 */
export function validateProductForm(formData: ProductFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Product name is required";
  }

  if (!formData.sku.trim()) {
    errors.sku = "SKU is required";
  }

  if (!formData.category) {
    errors.category = "Category is required";
  }

  if (formData.price <= 0) {
    errors.price = "Price must be greater than 0";
  }

  if (formData.reorderPoint < 0) {
    errors.reorderPoint = "Reorder point cannot be negative";
  }

  if (formData.available < 0) {
    errors.available = "Available units cannot be negative";
  }

  if (!formData.productDescription.trim()) {
    errors.productDescription = "Product description is required";
  }

  return errors;
}

/**
 * Normalizes numeric input - blocks negative values
 */
export function normalizeNumericInput(value: string): number | string {
  if (value.includes("-")) {
    return 0; // Reject negative
  }
  const numValue = parseFloat(value);
  return value === "" ? 0 : numValue || 0;
}

/**
 * Sanitizes SKU input - allows only alphanumeric and hyphens
 */
export function sanitizeSKU(value: string, maxLength: number = 20): string {
  return value
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toUpperCase()
    .slice(0, maxLength);
}

/**
 * Trims and limits product name
 */
export function sanitizeProductName(value: string, maxLength: number = 100): string {
  return value.slice(0, maxLength);
}
