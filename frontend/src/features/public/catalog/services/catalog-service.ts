import { api } from "@/lib/api";

export interface AddToCartPayload {
  productId: number | string;
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

export const catalogService = {
  getProducts: async () => {
    return api.get("cart/products").json<any[]>();
  },

  addToCart: async (payload: AddToCartPayload): Promise<CartItem> => {
    return api.post("cart/add", { json: payload }).json<CartItem>();
  },

  getCart: async (): Promise<CartResponse> => {
    return api.get("cart").json<CartResponse>();
  },

  updateCartItem: async (id: number, quantity: number): Promise<CartItem> => {
    return api.patch(`cart/update`, { json: { id, quantity } }).json<CartItem>();
  },

  removeFromCart: async (itemId: number): Promise<void> => {
    return api.delete(`cart/${itemId}`).json<void>();
  },

  clearCart: async (): Promise<void> => {
    return api.delete("cart/clear").json<void>();
  },
};