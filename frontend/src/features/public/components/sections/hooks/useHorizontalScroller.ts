import { useCallback, useEffect, useRef, useState } from "react";

interface UseHorizontalScrollerOptions {
  scrollAmount?: number;
}

export function useHorizontalScroller(
  options: UseHorizontalScrollerOptions = {},
) {
  const { scrollAmount = 320 } = options;

  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [scrollProgress, setScrollProgress] = useState({
    thumbWidthPct: 100,
    thumbLeftPct: 0,
  });

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    const maxScrollLeft = scrollWidth - clientWidth;

    setCanScrollPrev(scrollLeft > 1);
    setCanScrollNext(scrollLeft < maxScrollLeft - 1);

    // Calculate mobile progress thumb
    if (scrollWidth <= clientWidth) {
      setScrollProgress({
        thumbWidthPct: 100,
        thumbLeftPct: 0,
      });
    } else {
      const thumbWidthPct = (clientWidth / scrollWidth) * 100;

      const thumbLeftPct =
        maxScrollLeft > 0
          ? (scrollLeft / maxScrollLeft) * (100 - thumbWidthPct)
          : 0;

      setScrollProgress({
        thumbWidthPct,
        thumbLeftPct,
      });
    }
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollState();

    container.addEventListener("scroll", updateScrollState);

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const scrollPrev = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: -container.clientWidth * 0.8,
      behavior: "smooth",
    });
  }, []);

  const scrollNext = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: container.clientWidth * 0.8,
      behavior: "smooth",
    });
  }, []);

  return {
    scrollRef,
    canScrollPrev,
    canScrollNext,
    scrollProgress,
    scrollPrev,
    scrollNext,
    updateScrollState,
  };
}