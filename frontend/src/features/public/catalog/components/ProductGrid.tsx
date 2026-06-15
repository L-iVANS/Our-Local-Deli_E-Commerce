"use client";

import React from "react";
import CatalogProductCard from "./CatalogProductCard";

interface Product {
  productId: number;
  productName: string;
  category: {
    categoryName: string;
  };
  productPrice: number;
  imageUrl?: string;
}

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: any) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-12 md:gap-y-20">
      {products.map((product) => (
        <CatalogProductCard 
          key={product.id}
          product={product} 
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
