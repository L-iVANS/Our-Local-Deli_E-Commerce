import { ProductCard } from "../../../../components/cards/ProductCard";
import type { Product } from "../../../../data/products";
import type { ProductPriceType } from "../../../../data/pricing";

interface ProductsGridProps {
  products: Product[];
  priceType: ProductPriceType;
}

export function ProductsGrid({ products, priceType }: ProductsGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No products available.</p>
      </div>
    );
  }

  const validProducts = products.filter((p) => p && p.id && p.name);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {validProducts.map((p) => (
        <ProductCard key={p.id} product={p} showPricing={priceType} />
      ))}
    </div>
  );
}
