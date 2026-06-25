// src/features/public/cart/services/mutation.tsx

import { api } from "@/lib/api";
import { HTTPError } from "ky";

export interface PlaceOrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface PlaceOrderDelivery {
  address: string;
  contactPerson: string;
  contactNumber: string;
  deliveryDate: string;
  notes: string;
}

export interface PlaceOrderPayload {
  items: PlaceOrderItem[];
  delivery: PlaceOrderDelivery;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: "e-payment" | "manual_transfer";
}

export interface PlaceOrderResult {
  success: boolean;
  orderNumber: string;
  message: string;
  orderId: number;
  createdAt: string;
}

// export const placeOrderService = {
//   placeOrder: async (payload: PlaceOrderPayload) => {
//     try {
//       const response = await api.post("orders/place", {
//         json: payload,
//       });

//       return await response.json<PlaceOrderResult>();
//     } catch (err: any) {
//       if (err.response) {
//         console.log("Backend error:", await err.response.clone().json());
//       }

//       throw err;
//     }
//   },
// };

// mutation.tsx

export const placeOrderService = {
  placeOrder: async (payload: PlaceOrderPayload) => {
    try {
      return await api
        .post("orders/place", {
          json: payload,
        })
        .json<PlaceOrderResult>();
    } catch (error) {
      if (error instanceof HTTPError) {
        const responseText = await error.response.text();

        console.error("STATUS:", error.response.status);
        console.error("RESPONSE:", responseText);
      }

      throw error;
    }
  },
};
