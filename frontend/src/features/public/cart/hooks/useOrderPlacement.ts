// src/features/public/cart/hooks/useOrderPlacement.ts

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePlaceOrder } from "../services";
import { CartItem, DeliveryDetails } from "../types";
import { getDiscountRate } from "../constants/cartConstants";

export type CartAuthCompany = {
  userId?: number;
};

export const useOrderPlacement = (
  selectedItems: CartItem[],
  selectedSubtotal: number,
  delivery: DeliveryDetails,
  currentCompany: CartAuthCompany | null,
  removeItems: (ids: string[]) => void,
  setErrors: (errors: Partial<DeliveryDetails>) => void
) => {
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState<number | undefined>(undefined);
  const [orderNumber, setOrderNumber] = useState<string | undefined>(undefined);
  const [paymentTrigger, setPaymentTrigger] = useState<{
    orderId: number;
    orderNumber: string;
    orderAmount: number;
  } | null>(null);

  // ✅ TanStack mutation — replaces Apollo's [placeOrderMutation] = usePlaceOrder()
  const { mutateAsync: placeOrderMutation } = usePlaceOrder();

  const handlePlaceOrder = useCallback(
    async (
      paymentMethod: "e-payment" | "manual_transfer",
      validateForm: () => boolean
    ) => {
      if (selectedItems.length === 0) {
        setErrors({ notes: "Select at least one item to checkout." });
        return;
      }

      if (!validateForm()) return;

      if (!confirmed) {
        setErrors({ notes: "Please confirm your order before proceeding." });
        return;
      }

      if (!currentCompany?.userId) {
        setErrors({ notes: "Please log in to place an order." });
        return;
      }

      const itemCount = selectedItems.reduce((sum, item) => sum + item.qty, 0);
      const discountRate = getDiscountRate(itemCount);
      const discountAmount = Math.round(selectedSubtotal * discountRate);
      const discountedSubtotal = selectedSubtotal - discountAmount;
      const deliveryFee = selectedSubtotal >= 1500 ? 0 : 350;
      const grandTotal = discountedSubtotal + deliveryFee;

      setPlacing(true);
      setPaymentTrigger(null);

      try {
        const payload = {
          items: selectedItems.map((item: CartItem) => ({
            productId: parseInt(String(item.product.id), 10),
            quantity: parseInt(String(item.qty), 10),
            unitPrice: parseFloat(String(item.unitPrice)),
          })),
          delivery,
          subtotal: parseFloat(String(discountedSubtotal)),
          deliveryFee: parseFloat(String(deliveryFee)),
          grandTotal: parseFloat(String(grandTotal)),
          paymentMethod,
        };

        console.log(
          "[useOrderPlacement] Sending request with payload:",
          JSON.stringify(payload, null, 2)
        );

        // ✅ Direct call — no more { variables: { input: ... } } Apollo wrapper
        const result = await placeOrderMutation(payload);

        console.log("[useOrderPlacement] Response:", result);

        // ✅ Flat response — no more responseData?.placeOrder nesting
        if (!result?.orderId) {
          console.error("[useOrderPlacement] No orderId in response:", result);
          setErrors({ notes: "No response from server. Please try again." });
          return;
        }

        removeItems(selectedItems.map((item) => item.product.id));

        if (paymentMethod === "e-payment") {
          setPaymentTrigger({
            orderId: result.orderId,
            orderNumber: result.orderNumber,
            orderAmount: grandTotal,
          });
          setShowModal(false);
          return;
        }

        router.push(
          `/b2b/order-success?orderNumber=${result.orderNumber}&orderId=${result.orderId}&grandTotal=${grandTotal}`
        );
      } catch (error) {
        let errorMessage = "Failed to place order";

        if (error instanceof Error) {
          errorMessage = error.message;
          console.error("[useOrderPlacement] Order placement error:", {
            message: error.message,
            name: error.name,
          });
        } else {
          console.error(
            "[useOrderPlacement] Unknown error:",
            String(error)
          );
        }

        setErrors({ notes: errorMessage });
      } finally {
        setPlacing(false);
      }
    },
    [
      selectedItems,
      confirmed,
      delivery,
      selectedSubtotal,
      currentCompany?.userId,
      removeItems,
      router,
      setErrors,
      placeOrderMutation,
    ]
  );

  const handleCloseModal = useCallback(() => {
    console.log("[useOrderPlacement] handleCloseModal called");
    setShowModal(false);
    setErrors({});
    setConfirmed(false);
  }, [setErrors]);

  const resetPaymentTrigger = useCallback(() => {
    setPaymentTrigger(null);
  }, []);

  return {
    showModal,
    setShowModal,
    confirmed,
    setConfirmed,
    placing,
    orderId,
    orderNumber,
    paymentTrigger,
    handlePlaceOrder,
    handleCloseModal,
    resetPaymentTrigger,
  };
};