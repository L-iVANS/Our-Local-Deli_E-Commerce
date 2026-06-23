"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useCatalogProducts } from "@/features/public/catalog/hooks/useCatalogProducts";
import { useSearchParams } from "next/navigation";
import { productsData } from "@/data/products";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/Footer";
import CatalogHeader from "./components/CatalogHeader";
import FilterPanel from "./components/FilterPanel";
import ViewToggle from "./components/ViewToggle";
import ProductGrid from "./components/ProductGrid";
import ProductList from "./components/ProductList";
import ProductModal from "./components/ProductModal";
import type { Product } from "@/src/data/products";
import { motion, AnimatePresence } from "framer-motion";
import LoginModal from "./components/LoginModal";
// import { useCurrentUser } from "../catalog/hooks/useCurrentUser";
import type { SessionUser } from "../../../lib/session";
import { useCurrentUser } from "./hooks/useCurrentUser";

interface CatalogContainerProps {
    initialUser: SessionUser | null;
  }

const CatalogContainer = ({ initialUser }: CatalogContainerProps) => {
  const searchParams = useSearchParams();

  // // ✅ Replaces the broken getUserIdFromCookie + useState approach
  const { user, refresh: refreshUser } = useCurrentUser(initialUser);
  const userId = user?.userId;

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceType, setPriceType] = useState("Retail");
  const [sortBy, setSortBy] = useState("Featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  // Data Fetching
  const {
    data: productsResponse,
    isLoading: loading,
  } = useCatalogProducts();

  // Fallback Logic
  const products = useMemo((): Product[] => {
    const source =
      productsResponse && productsResponse.length > 0
        ? productsResponse
        : productsData;

    return source.map(
      (p: any): Product => ({
        productId: p.productId ?? p.id,
        productName: p.productName ?? p.name,
        productPrice:
          typeof p.productPrice === "string"
            ? parseFloat(p.productPrice.replace(/[₱,]/g, ""))
            : typeof p.price === "string"
              ? parseFloat(p.price.replace(/[₱,]/g, ""))
              : (p.productPrice ?? p.price ?? 0),
        retailPrice: p.retailPrice ?? p.productPrice ?? p.price,
        imageUrl: p.imageUrl ?? p.image,
        category: String(p.categoryId ?? p.category ?? p.categoryName ?? "")
          .toLowerCase()
          .replace(/\s+/g, "-")
          .trim(),
        rating: p.rating ?? 0,
        description: p.productDescription ?? p.description ?? "",
      }),
    );
  }, [productsResponse]);

  const categories = useMemo(() => {
    const map = new Map<string, { id: string; name: string; slug: string }>();

    products.forEach((p: Product) => {
      const raw = p.category;
      if (!raw) return;

      if (!map.has(raw)) {
        map.set(raw, {
          id: raw,
          name: raw,
          slug: raw,
        });
      }
    });

    return Array.from(map.values());
  }, [products]);

  // Deep Linking Effect
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categories.length > 0) {
      const foundCategory = categories.find(
        (c: any) =>
          c.slug === categoryParam.toLowerCase() ||
          c.name.toLowerCase() === categoryParam.toLowerCase(),
      );
      if (foundCategory) {
        setSelectedCategoryId(foundCategory.id);
      }
    }

    if (products.length > 0) {
      const productId = searchParams.get("productId");
      if (productId) {
        const product = products.find(
          (p: any) => p.productId.toString() === productId,
        );
        if (product) {
          setSelectedProduct(product);
          setIsModalOpen(true);
        }
      }
    }
  }, [products, categories, searchParams]);

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategoryId) {
      result = result.filter((p) => p.category === selectedCategoryId);
    }

    if (sortBy === "Price: Low → High") {
      result.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortBy === "Price: High → Low") {
      result.sort((a, b) => b.productPrice - a.productPrice);
    } else if (sortBy === "Best Rated") {
      result.sort(
        (a, b) => (Number(b.productId) % 5) - (Number(a.productId) % 5),
      );
    }

    return result;
  }, [products, searchTerm, selectedCategoryId, sortBy]);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleRequireLogin = (product: Product) => {
    setPendingProduct(product);
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    refreshUser(); // ✅ calls GET /auth/me → gets real userId via httpOnly cookie

    // ✅ Re-open product modal so user can immediately add to cart
    if (pendingProduct) {
      setSelectedProduct(pendingProduct);
      setIsModalOpen(true);
      setTimeout(() => setPendingProduct(null), 500);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <Header forceTheme="A" />

      <CatalogHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        productCount={filteredProducts.length}
      />

      <main className="container mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col gap-10">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <FilterPanel
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={setSelectedCategoryId}
              />
            </div>

            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              priceType={priceType}
              onPriceTypeChange={setPriceType}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          <div className="min-h-[400px]">
            {loading && !products.length ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col gap-4">
                    <div className="aspect-square bg-neutral-100 rounded-[32px]" />
                    <div className="h-4 bg-neutral-100 rounded w-1/2" />
                    <div className="h-6 bg-neutral-100 rounded w-3/4" />
                    <div className="h-4 bg-neutral-100 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {viewMode === "grid" ? (
                    <ProductGrid
                      products={filteredProducts}
                      onProductClick={handleProductClick}
                    />
                  ) : (
                    <ProductList
                      products={filteredProducts}
                      onProductClick={handleProductClick}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6 text-neutral-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">
                  No products found
                </h3>
                <p className="text-neutral-400">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategoryId(null);
                  }}
                  className="mt-6 text-primary font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}            // ✅ real number after login, undefined when logged out
        onRequireLogin={handleRequireLogin}
        onCartUpdate={refreshUser} // ✅ keeps session fresh
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess} // ✅ triggers refreshUser → userId updates
        triggerContext={{
          action: "add-to-cart",
          productName: pendingProduct?.productName,
        }}
      />
    </div>
  );
};

export default CatalogContainer;