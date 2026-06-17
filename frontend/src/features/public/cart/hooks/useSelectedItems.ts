import { useMemo } from "react";
import { CartItem } from "../types";

export const useSelectedItems = (items: CartItem[], selectedItemIds: string[]) => {
  const selectedItems = useMemo(() => items.filter((item) => selectedItemIds.includes(item.product.id)), [items, selectedItemIds]);

  const selectedItemCount = useMemo(() => selectedItems.reduce((sum, item) => sum + item.qty, 0), [selectedItems]);

  const selectedSubtotal = useMemo(() => selectedItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0), [selectedItems]);

  return { selectedItems, selectedItemCount, selectedSubtotal };
};
