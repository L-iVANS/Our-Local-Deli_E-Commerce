import { api } from "@/lib/api";

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface CurrentUser {
  userId: number;
  emailAddress: string;
  role: string;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface AddToCartPayload {
  productId: number; // ✅ strictly number only
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  selectedColor?: string;
  selectedSize?: string;
  createdAt: string;
  product?: {
    productId: number;
    productName: string;
    productPrice: number;
    imageUrl?: string;
    category?: {
      categoryName: string;
    };
  };
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// ─── Services ────────────────────────────────────────────────────────────────

export const authService = {
  // Calls /auth/me — NestJS reads the httpOnly cookie automatically
  // Returns null if not logged in (401) instead of throwing
  getMe: async (): Promise<CurrentUser | null> => {
    try {
      return await api.get("auth/me").json<CurrentUser>();
    } catch {
      return null;
    }
  },
};

export const catalogService = {
  getProducts: async () => {
    return api.get("cart/products").json<any[]>();
  },

  addToCart: async (payload: AddToCartPayload): Promise<CartItem> => {
    // ✅ Force productId to be a number before sending
    const sanitized = {
      ...payload,
      productId: Number(payload.productId),
      quantity: Number(payload.quantity),
    };
    return api.post("cart", { json: sanitized }).json<CartItem>();
  },

  getCart: async (): Promise<CartResponse> => {
    return api.get("cart").json<CartResponse>();
  },

  updateCartItem: async (id: number, quantity: number): Promise<CartItem> => {
    return api.patch(`cart/items/${id}`, { json: { quantity } }).json<CartItem>();
  },

  removeFromCart: async (itemId: number): Promise<void> => {
    return api.delete(`cart/items/${itemId}`).json<void>();
  },

  clearCart: async (): Promise<void> => {
    return api.delete("cart").json<void>();
  },
};