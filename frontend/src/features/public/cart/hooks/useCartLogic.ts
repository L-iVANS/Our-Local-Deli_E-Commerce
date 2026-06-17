import { useCallback, useState } from "react";
import { useAuth } from "@/features/auth";
import { useCart } from "./useCart";
import { useItemSelection } from "./useItemSelection";
import { useSelectedItems } from "./useSelectedItems";
import { useMoqWarnings, useSelectedMoqWarnings } from "./useMoqWarnings";
import { useDeliveryForm } from "./useDeliveryForm";
import { useOrderPlacement } from "./useOrderPlacement";
import { useEnrichedCompanyProfile } from "./useEnrichedCompanyProfile";
import { normalizeCompany, CartAuthCompany } from "./useCompany";
import { useUpdateCartItem } from "./useUpdateCartItems";
import { useRemoveCartItem } from "./useRemoveCartItem";

/**
 * Custom hook for managing cart logic and state
 * Handles: delivery form, order confirmation, MOQ warnings, etc.
 */
export function useCartLogic() {
  const { isLoggedIn, company: authCompany } = useAuth();
  const { company: enrichedCompany } = useEnrichedCompanyProfile();
  const { data: cart, isLoading } = useCart();
  const currentCompany = enrichedCompany as CartAuthCompany | null;

  const company = normalizeCompany(currentCompany);
  const items = cart?.items ?? [];

  const itemCount = items.reduce((total, item) => total + item.qty, 0);

  const subtotal = items.reduce(
    (total, item) => total + item.qty * item.unitPrice,
    0,
  );
  const { selectedItemIds, setSelectedItemIds, toggleItemSelection } =
    useItemSelection(items);
  const { selectedItems, selectedItemCount, selectedSubtotal } =
    useSelectedItems(items, selectedItemIds);
  const { delivery, setDelivery, errors, setErrors, validateForm } =
    useDeliveryForm(company, currentCompany);

  const moqWarnings = useMoqWarnings(items);
  const selectedMoqWarnings = useSelectedMoqWarnings(selectedItems);

  const {
    showModal,
    setShowModal,
    confirmed,
    setConfirmed,
    placing,
    orderId,
    orderNumber,
    paymentTrigger,
    handlePlaceOrder: _handlePlaceOrder,
    handleCloseModal,
    resetPaymentTrigger,
  } = useOrderPlacement(
    selectedItems,
    selectedSubtotal,
    delivery,
    currentCompany,
    () => {},
    setErrors,
  );

  const handlePlaceOrder = useCallback(
    async (paymentMethod: "e-payment" | "manual_transfer") => {
      await _handlePlaceOrder(paymentMethod, validateForm);
    },
    [_handlePlaceOrder, validateForm],
  );

  const toggleSelection = useCallback(
    (productId: string) => {
      toggleItemSelection(productId);
      setErrors((prev) => ({ ...prev, notes: undefined }));
    },
    [toggleItemSelection, setErrors],
  );

  const { mutate: updateCartItem } = useUpdateCartItem();
  const { mutate: removeCartItem } = useRemoveCartItem();

  // In useCartLogic, convert to string when exposing the handlers
  const onUpdateQty = (productId: string, qty: number) => {
    updateCartItem({ id: Number(productId), quantity: qty });
  };

  const onRemoveItem = (productId: string) => {
    removeCartItem(Number(productId));
  };
  return {
    isLoggedIn,
    company,
    items,
    selectedItems,
    selectedItemIds,
    itemCount,
    selectedItemCount,
    subtotal,
    selectedSubtotal,
    tier: company.tier,
    showModal,
    setShowModal,
    delivery,
    setDelivery,
    confirmed,
    setConfirmed,
    errors,
    setErrors,
    placing,
    moqWarnings,
    selectedMoqWarnings,
    orderId,
    orderNumber,
    paymentTrigger,
    resetPaymentTrigger,
    hasSelectedItems: selectedItems.length > 0,
    handlePlaceOrder,
    handleCloseModal,
    onRemoveItem,
    onUpdateQty,
    onToggleItemSelection: toggleSelection,
  };
}
