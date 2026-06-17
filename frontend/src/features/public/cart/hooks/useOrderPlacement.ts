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
  const [paymentTrigger, setPaymentTrigger] = useState<{orderId: number; orderNumber: string; orderAmount: number} | null>(null);
  const [placeOrderMutation] = usePlaceOrder();

  const handlePlaceOrder = useCallback(
    async (paymentMethod: "e-payment" | "manual_transfer", validateForm: () => boolean) => {
      if (selectedItems.length === 0) {
        setErrors({ notes: "Select at least one item to checkout." });
        return;
      }

      if (!validateForm()) return;

      if (!confirmed) {
        setErrors({ notes: "Please confirm your order before proceeding." });
        return;
      }

      // Check authentication before attempting order
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
        const mutationInput = {
          items: selectedItems.map((item: CartItem) => ({
            productId: parseInt(String(item.product.id), 10),
            quantity: parseInt(String(item.qty), 10),
            unitPrice: parseFloat(String(item.unitPrice)),
          })),
          delivery,
          subtotal: parseFloat(String(discountedSubtotal)),
          deliveryFee: parseFloat(String(deliveryFee)),
          grandTotal: parseFloat(String(grandTotal)),
          userId: currentCompany?.userId || 0,
          companyId: currentCompany?.userId?.toString(),
          paymentMethod,
        };

        console.log("[useOrderPlacement] Sending mutation with input:", JSON.stringify(mutationInput, null, 2));

        const result = await placeOrderMutation({
          variables: {
            input: mutationInput,
          },
        });

        console.log("[useOrderPlacement] Mutation response:", result);

        const responseData = result.data as any;
        if (!responseData?.placeOrder) {
          const noDataMessage = "No response from server. Please try again.";
          console.error("[useOrderPlacement] No data returned:", responseData);
          setErrors({ notes: noDataMessage });
          return;
        }

        const { placeOrder } = responseData;
        removeItems(selectedItems.map((item) => item.product.id));
        if (paymentMethod === "e-payment") {
          setPaymentTrigger({
            orderId: placeOrder.orderId,
            orderNumber: placeOrder.orderNumber,
            orderAmount: grandTotal,
          });
          setShowModal(false);
          return;
        }

        router.push(
          `/b2b/order-success?orderNumber=${placeOrder.orderNumber}&orderId=${placeOrder.orderId}&grandTotal=${grandTotal}`
        );
      } catch (error) {
        let errorMessage = "Failed to place order";

        try {
          if (error instanceof Error) {
            errorMessage = error.message;
            console.error("[useOrderPlacement] Order placement exception:", {
              message: error.message,
              name: error.name,
              stack: error.stack,
            });
          } else if (typeof error === 'object' && error !== null) {
            const errorObj = error as any;
            console.error("[useOrderPlacement] Order placement exception:", {
              message: errorObj.message || 'Unknown error',
              networkError: errorObj.networkError,
              graphQLErrors: errorObj.graphQLErrors,
              statusCode: errorObj.statusCode,
              originalError: errorObj.originalError,
            });
            errorMessage = errorObj.message || "Failed to place order";
          } else {
            console.error("[useOrderPlacement] Order placement exception:", String(error));
          }
        } catch (logError) {
          console.error("[useOrderPlacement] Failed to log error properly:", String(logError));
        }

        setErrors({ notes: errorMessage });
      } finally {
        setPlacing(false);
      }
    },
    [selectedItems, confirmed, delivery, selectedSubtotal, currentCompany?.userId, removeItems, router, setErrors, placeOrderMutation]
  );

  const handleCloseModal = useCallback(() => {
    console.log("[useOrderPlacement] handleCloseModal called");
    // IMPORTANT: Don't reset orderId and orderNumber here - they need to persist for PayMongo modal
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
