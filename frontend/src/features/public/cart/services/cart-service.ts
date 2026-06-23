// src/features/public/cart/services/cart-service.ts
import { api } from "@/lib/api";
import type { CartItem } from "../types";

// ─── Backend Response Types ──────────────────────────────────────────────────

interface BackendCartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  unitPrice: string | number;
  selectedColor?: string;
  selectedSize?: string;
  createdAt: string;
  product?: {
    productId: number;
    productName: string;
    productPrice: number;
    imageUrl?: string;
    category?: {
      categoryId?: number;
      categoryName: string;
    };
  };
}

interface BackendCartResponse {
  items: BackendCartItem[];
  totalItems: number;
  totalPrice: number;
}

// ─── Mapper ──────────────────────────────────────────────────────────────────

function mapBackendCartItem(item: BackendCartItem): CartItem {
  return {
    id: item.id, // ✅ backend cart row id (used for update/delete)
    qty: item.quantity,
    unitPrice: Number(item.unitPrice),
    selectedColor: item.selectedColor,
    selectedSize: item.selectedSize,
    product: {
      id: String(item.product?.productId ?? item.productId),
      name: item.product?.productName ?? "Unknown Product",
      category: item.product?.category?.categoryName ?? "Uncategorized",
      imageUrl: item.product?.imageUrl,
      image: item.product?.imageUrl,
      retailPrice: item.product?.productPrice ?? 0,
    },
  };
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const cartService = {
  // GET /cart
  getCart: async (): Promise<{
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
  }> => {
    const response = await api.get("cart").json<BackendCartResponse>();
    return {
      items: response.items.map(mapBackendCartItem),
      totalItems: response.totalItems,
      totalPrice: Number(response.totalPrice),
    };
  },

  // PATCH /cart/items/:id
  updateQty: async (cartItemId: number, quantity: number): Promise<CartItem> => {
    const updated = await api
      .patch(`cart/items/${cartItemId}`, { json: { quantity } })
      .json<BackendCartItem>();
    return mapBackendCartItem(updated);
  },

  // DELETE /cart/items/:id
  removeItem: async (cartItemId: number): Promise<void> => {
    await api.delete(`cart/items/${cartItemId}`).json();
  },

  // DELETE /cart/items/by-product/:productId
  removeByProductId: async (productId: number): Promise<void> => {
    await api.delete(`cart/items/by-product/${productId}`).json();
  },

  // DELETE /cart
  clearCart: async (): Promise<void> => {
    await api.delete("cart").json();
  },

  // Kept your existing endpoint
  getProducts: async () => {
    return api.get("cart/products").json<any[]>();
  },
};