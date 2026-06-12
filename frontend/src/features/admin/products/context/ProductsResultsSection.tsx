import { NoProducts } from "../components/NoProducts";
import { ProductsGrid } from "../components/ProductsGrid";
import { ProductsList } from "../components/ProductsList";
import { useProductsPage } from "./ProductsPageProvider";

export function ProductsResultsSection() {
  const { filteredProducts, priceType, viewMode, loading, error } = useProductsPage();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("ProductsResultsSection error:", error);
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-red-600 max-w-md">
          <p className="text-lg font-semibold">Error loading products</p>
          <p className="mt-2 text-sm">{String(error)}</p>
          <p className="mt-4 text-xs text-gray-500">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (!filteredProducts || filteredProducts.length === 0) {
    return <NoProducts />;
  }

  if (viewMode === "grid") {
    return <ProductsGrid products={filteredProducts} priceType={priceType} />;
  }

  return <ProductsList products={filteredProducts} priceType={priceType} />;
}
