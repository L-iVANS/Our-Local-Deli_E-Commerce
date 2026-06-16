"use client";

import React from "react";
import CatalogProductCard from "./CatalogProductCard";
import type { Product } from "@/src/data/products";

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductClick,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-12 md:gap-y-20">
      {products.map((product) => (
        <CatalogProductCard
          key={product.productId}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
