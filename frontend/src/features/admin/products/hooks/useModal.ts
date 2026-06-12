import { useState, useEffect } from "react";

/**
 * Custom hook to manage modal animation state
 * Handles the transition between open and closed states with animations
 */
export function useModal() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Trigger animation when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const open = () => setIsOpen(true);
  
  const close = () => setIsOpen(false);

  /**
   * Call this in onAnimationEnd to clean up state after animation completes
   */
  const handleAnimationEnd = (currentIsOpen: boolean) => {
    if (!currentIsOpen) {
      setIsAnimating(false);
    }
  };

  return {
    isOpen,
    isAnimating,
    open,
    close,
    toggle: () => setIsOpen(!isOpen),
    handleAnimationEnd,
  };
}
