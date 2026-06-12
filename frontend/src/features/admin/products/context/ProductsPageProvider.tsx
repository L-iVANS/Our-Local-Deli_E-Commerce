"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "../hooks/service-hooks/use-products";
import type { Product } from "../../../../data/products";
import {
  getProductPrice,
  type ProductPriceType,
} from "../../../../data/pricing";

type ViewMode = "grid" | "list";
type SortMode = "featured" | "price-asc" | "price-desc" | "rating";

interface ProductsPageContextValue {
  activeCategory: string;
  search: string;
  sort: SortMode;
  viewMode: ViewMode;
  priceType: ProductPriceType;
  filteredProducts: Product[];
  setCategory: (category: string) => void;
  setSearch: (value: string) => void;
  setSort: (value: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setPriceType: (type: ProductPriceType) => void;
  loading: boolean;
  error: string | null;
}

const ProductsPageContext = createContext<ProductsPageContextValue | null>(null);

export function ProductsPageProvider({ 
  children, 
  initialCategory = "All" 
}: { 
  children: ReactNode;
  initialCategory?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [sort, setSort] = useState<SortMode>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [priceType, setPriceType] = useState<ProductPriceType>("retail");

  // Fetch products from GraphQL
  const { data, isLoading: loading, error } = useProducts();

  const activeCategory = initialCategory || "All";
  const search = params?.get("q") || "";

  // Normalize category from URL format to display format
  const normalizeCategory = (category: string): string => {
    if (category.toLowerCase() === "all") return "All";
    if (category === "vacuum-flask") return "Vacuum Flask";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const displayCategory = normalizeCategory(activeCategory);

  const setCategory = (category: string) => {
    const normalizedCategory = category === "All" ? "all" : category.toLowerCase().replace(" ", "-");
    if (normalizedCategory === "all") {
      router.push(`/b2b/products/all`);
    } else {
      router.push(`/b2b/products/category/${normalizedCategory}`);
    }
  };

  const setSortValue = (value: string) => {
    setSort(value as SortMode);
  };

  const setViewModeValue = (value: string) => {
    setViewMode(value as ViewMode);
  };

  const setSearchValue = (value: string) => {
    const params = new URLSearchParams();
    if (value) {
      params.set("q", value);
    }
    const queryString = params.toString();
    let urlPath: string;
    if (initialCategory.toLowerCase() === "all") {
      urlPath = `/b2b/products/all`;
    } else {
      urlPath = `/b2b/products/category/${initialCategory.toLowerCase().replace(" ", "-")}`;
    }
    router.push(queryString ? `${urlPath}?${queryString}` : urlPath);
  };

  const setPriceTypeValue = (type: ProductPriceType) => {
    setPriceType(type);
  };

  // Transform GraphQL data to Product format
  const products: Product[] = useMemo(() => {
    if (!data) return [];
    return data
      .filter((product) => {
        // Ensure product has required fields
        if (!product.productId || !product.productName) {
          console.warn("Product missing required fields:", product);
          return false;
        }
        return true;
      })
      .map((product) => {
        const basePrice = product.productPrice || 0;
        const categoryName = typeof product.category === 'string' 
          ? product.category 
          : (product.category?.categoryName || "Uncategorized");
        
        return {
          id: product.productId.toString(),
          name: product.productName || "Unnamed Product",
          price: Math.round(basePrice),
          retailPrice: Math.round(basePrice),
          wholesalePrice: Math.round(basePrice * 0.92),
          bulkPrice: Math.round(basePrice * 0.84),
          minWholesale: 10,
          minBulk: 50,
          image:
            "https://images.unsplash.com/photo-1696986324692-f4aa0f2f495d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
          imageUrl: product.imageUrl || undefined,
          category: categoryName,
          rating: 4.5,
        };
      });
  }, [data]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (displayCategory !== "All") {
      // Use case-insensitive comparison for category filtering
      list = list.filter((product) => {
        const productCat = (product.category || "").trim().toLowerCase();
        const filterCat = displayCategory.trim().toLowerCase();
        return productCat === filterCat;
      });
    }

    if (search) {
      list = list.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (sort === "price-asc") {
      return list.sort(
        (a, b) => getProductPrice(a, priceType) - getProductPrice(b, priceType),
      );
    }

    if (sort === "price-desc") {
      return list.sort(
        (a, b) => getProductPrice(b, priceType) - getProductPrice(a, priceType),
      );
    }

    if (sort === "rating") {
      return list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [displayCategory, priceType, search, sort, products]);

  const value = useMemo(
    () => ({
      activeCategory: displayCategory,
      search,
      sort,
      viewMode,
      priceType,
      filteredProducts,
      setCategory,
      setSearch: setSearchValue,
      setSort: setSortValue,
      setViewMode: setViewModeValue,
      setPriceType: setPriceTypeValue,
      loading,
      error: error?.message || null,
    }),
    [displayCategory, filteredProducts, priceType, search, sort, viewMode, loading, error],
  );

  return (
    <ProductsPageContext.Provider value={value}>
      {children}
    </ProductsPageContext.Provider>
  );
}

export function useProductsPage() {
  const context = useContext(ProductsPageContext);

  if (!context) {
    throw new Error("useProductsPage must be used within ProductsPageProvider");
  }

  return context;
}
