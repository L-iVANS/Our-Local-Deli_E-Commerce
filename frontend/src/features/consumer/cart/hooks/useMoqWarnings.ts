import { useMemo } from "react";
import { CartItem } from "../types";

const getMoqWarnings = (items: CartItem[]): CartItem[] => {
  return [];
};

export const useMoqWarnings = (items: CartItem[]) => {
  const moqWarnings = useMemo(() => getMoqWarnings(items), [items]);

  return moqWarnings;
};

export const useSelectedMoqWarnings = (selectedItems: CartItem[]) => {
  const selectedMoqWarnings = useMemo(() => getMoqWarnings(selectedItems), [selectedItems]);

  return selectedMoqWarnings;
};
