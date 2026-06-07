import { useState, useCallback, useEffect, useRef } from "react";
import { CartItem } from "../types";

export const useItemSelection = (items: CartItem[]) => {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const hasInitializedSelection = useRef(false);

  useEffect(() => {
    if (items.length === 0) {
      setSelectedItemIds([]);
      hasInitializedSelection.current = false;
      return;
    }

    if (!hasInitializedSelection.current) {
      setSelectedItemIds(items.map((item) => item.product.id));
      hasInitializedSelection.current = true;
      return;
    }

    setSelectedItemIds((currentSelected) => {
      const availableIds = new Set(items.map((item) => item.product.id));
      return currentSelected.filter((id) => availableIds.has(id));
    });
  }, [items]);

  const toggleItemSelection = useCallback((productId: string) => {
    setSelectedItemIds((currentSelected) =>
      currentSelected.includes(productId)
        ? currentSelected.filter((id) => id !== productId)
        : [...currentSelected, productId]
    );
  }, []);

  return { selectedItemIds, setSelectedItemIds, toggleItemSelection };
};
