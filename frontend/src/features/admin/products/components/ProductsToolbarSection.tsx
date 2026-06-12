import { FilterBar } from "./FilterBar";
import { PricingNotice } from "./PricingNotice";
import { useProductsPage } from "../context/ProductsPageProvider";

export function ProductsToolbarSection() {
  const {
    activeCategory,
    priceType,
    search,
    sort,
    viewMode,
    setCategory,
    setPriceType,
    setSearch,
    setSort,
    setViewMode,
  } = useProductsPage();

  return (
    <>
      <FilterBar
        activeCategory={activeCategory}
        search={search}
        sort={sort}
        viewMode={viewMode}
        priceType={priceType}
        onCategoryChange={setCategory}
        onSearchChange={setSearch}
        onSortChange={setSort}
        onViewModeChange={setViewMode}
        onPriceTypeChange={setPriceType}
      />
      <PricingNotice priceType={priceType} />
    </>
  );
}
