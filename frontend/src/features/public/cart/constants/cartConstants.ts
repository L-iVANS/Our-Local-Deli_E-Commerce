export const CART_COLORS = {
  RED: "#bf262f",
  RED_LIGHT: "#f9e9ea",
} as const;

export const CART_CONFIG = {
  FREE_DELIVERY_THRESHOLD: 1500, // ₱1500
  DELIVERY_FEE: 350, // ₱350 when below threshold
  MOQ_WARNING_COLOR: "#92400e",
  MOQ_WARNING_BG: "#fffbeb",
  RETAIL_PRICE_COLOR: "#92400e",
} as const;

export const getDiscountRate = (itemCount: number) => {
  if (itemCount <= 0) return 0;
  if (itemCount <= 10) return 0.1;
  if (itemCount <= 20) return 0.2;
  return 0.3;
};

export const getDiscountLabel = (itemCount: number) => {
  if (itemCount <= 0) return "";
  if (itemCount <= 10) return "Retail 10%";
  if (itemCount <= 20) return "Wholesale 20%";
  return "Dealer 30%";
};
