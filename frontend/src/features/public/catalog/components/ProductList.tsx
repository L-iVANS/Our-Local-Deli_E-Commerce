"use client";

import React from "react";
import CatalogProductListItem from "./CatalogProductListItem";
import type { Product } from "@/src/data/products";


interface ProductListProps {
  products: Product[];
  onProductClick: (product: any) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductClick,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {products.map((product) => (
        <CatalogProductListItem
          key={product.productId}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default ProductList;
