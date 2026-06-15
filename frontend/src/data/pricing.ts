export type ProductPriceType = "retail" | "wholesale" | "bulk";

// Flexible product type that works with both data/products.Product and b2b cart Product
interface PricableProduct {
  price: number;
  rating?: number;
  category?: string | null;
}

const PRICE_MULTIPLIERS: Record<ProductPriceType, number> = {
  retail: 1,
  wholesale: 0.92,
  bulk: 0.84,
};

export function getRetailPrice(product: PricableProduct) {
  return product.price;
}

export function getProductPrice(product: PricableProduct, priceType: ProductPriceType) {
  return Math.round(product.price * PRICE_MULTIPLIERS[priceType]);
}

export function getProductReviewCount(product: PricableProduct) {
  return Math.max(12, Math.round((product.rating || 4.5) * 18));
}
