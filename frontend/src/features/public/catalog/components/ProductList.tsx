"use client";

import React from "react";
import CatalogProductListItem from "./CatalogProductListItem";

interface Product {
  productId: number;
  productName: string;
  category: {
    categoryName: string;
  };
  productPrice: number;
  imageUrl?: string;
}

interface ProductListProps {
  products: Product[];
  onProductClick: (product: any) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductClick }) => {
  return (
    <div className="flex flex-col gap-6">
      {products.map((product) => (
        <CatalogProductListItem 
          key={product.id}
          product={product} 
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default ProductList;
