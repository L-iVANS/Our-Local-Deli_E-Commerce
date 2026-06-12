'use client';

import { useState } from "react";
import { Download } from "lucide-react";
import { ProductsTable } from "@/features/admin/products/components/ProductsTable";
import { AddProductModal } from "@/features/admin/products/components/AddProductModal";
import { ArchiveConfirmDialog } from "@/components/modals/dialogs/ArchiveConfirmDialog";
import { AdjustStockModal } from "@/features/admin/products/components/AdjustStockModal";
import { ProductDetailsModal } from "@/features/admin/products/components/ProductDetailsModal";
import { useProductsPage } from "@/features/admin/products/hooks/productsHooks";
import { useCategoriesPage } from "@/features/admin/products/hooks/useCategoriesPage";
import { SearchInput } from "./components/SearchInput";
import { FilterDropdown } from "./components/FilterDropdown";
import { AddProductBtn } from "./components/AddProductBtn";
import { ProductsCard } from "./components/ProductsCard";
import { TabToggle } from "./components/TabToggle";
import { CategoriesTable } from "./components/CategoriesTable";
import { AddCategoryModal } from "./components/AddCategoryModal";
import { DeleteCategoryModal } from "./components/DeleteCategoryModal";

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  
  // Products hook
  const {
    // State
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    showFilterDropdown,
    setShowFilterDropdown,
    showAddProductModal,
    setShowAddProductModal,
    productToEdit,
    setProductToEdit,
    archiveDialogOpen,
    setArchiveDialogOpen,
    archiveLoading,
    adjustStockOpen,
    setAdjustStockOpen,
    adjustStockLoading,
    selectedProduct,
    setSelectedProduct,
    showDetailsModal,
    setShowDetailsModal,
    // Data
    filteredProducts,
    categories,
    statuses,
    totalItems,
    totalUnits,
    inTransitUnits,
    lowStockCount,
    loading,
    error,
    // Handlers
    handleAddProduct,
    handleEdit,
    handleViewDetails,
    handleAdjustStock,
    handleAdjustStockSubmit,
    handleArchive,
    handleArchiveConfirm,
  } = useProductsPage();

  // Categories hook
  const {
    categories: categoriesList,
    showAddModal: showAddCategoryModal,
    setShowAddModal: setShowAddCategoryModal,
    categoryToEdit,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedCategory: selectedCategoryForDelete,
    loading: categoryLoading,
    fetchLoading: categoryFetchLoading,
    error: categoryError,
    handleAddClick: handleAddCategoryClick,
    handleEditClick: handleEditCategoryClick,
    handleDeleteClick: handleDeleteCategoryClick,
    handleDeleteConfirm: handleDeleteCategoryConfirm,
    handleCloseModal: handleCloseCategoryModal,
    handleSubmitModal: handleSubmitCategoryModal,
  } = useCategoriesPage();

  if (activeTab === 'products' && loading) return <div className="p-8">Loading products...</div>;
  if (activeTab === 'products' && error) return <div className="p-8 text-red-600">Error: {error.message}</div>;
  if (activeTab === 'categories' && categoryFetchLoading) return <div className="p-8">Loading categories...</div>;
  if (activeTab === 'categories' && categoryError) return <div className="p-8 text-red-600">Error: {categoryError.message}</div>;

  return (
    <div className="space-y-6 px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 font-bold text-2xl">
            {activeTab === 'products' ? 'Product Inventory' : 'Categories'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeTab === 'products' 
              ? 'Manage your product inventory and stock levels'
              : 'Manage your product categories'}
          </p>
        </div>
        {activeTab === 'products' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {totalItems} products · {totalUnits} total units
            </span>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">
              <Download size={12} /> Export
            </button>
          </div>
        )}
      </div>

      {/* Tab Toggle */}
      <TabToggle activeTab={activeTab} onTabChange={setActiveTab} />

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <>
          {/* Summary Cards */}
          <ProductsCard 
            totalItems={totalItems} 
            totalUnits={totalUnits} 
            inTransitUnits={inTransitUnits} 
            lowStockCount={lowStockCount} 
          />

          {/* Search, Filter & Add Product Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <SearchInput 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />

            {/* Filter Dropdown */}
            <FilterDropdown 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              categories={categories} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
              statuses={statuses} 
              selectedStatus={selectedStatus} 
              setSelectedStatus={setSelectedStatus} 
              showFilterDropdown={showFilterDropdown} 
              setShowFilterDropdown={setShowFilterDropdown} 
            />

            {/* Add Product Button */}
            <AddProductBtn setShowAddProductModal={setShowAddProductModal} />
          </div>

          {/* Products Table */}
          <ProductsTable
            products={filteredProducts}
            emptyMessage="No products found matching your filters"
            onEdit={handleEdit}
            onViewDetails={handleViewDetails}
            onAdjustStock={handleAdjustStock}
            onArchive={handleArchive}
          />

          {/* Add Product Modal */}
          <AddProductModal
            isOpen={showAddProductModal}
            onClose={() => {
              setShowAddProductModal(false);
              setProductToEdit(null);
            }}
            onSubmit={handleAddProduct}
            productToEdit={productToEdit || undefined}
            categories={categoriesList}
          />

          {/* Archive Confirm Dialog */}
          {selectedProduct && (
            <ArchiveConfirmDialog
              isOpen={archiveDialogOpen}
              productName={selectedProduct.name}
              onConfirm={handleArchiveConfirm}
              onCancel={() => setArchiveDialogOpen(false)}
              isLoading={archiveLoading}
            />
          )}

          {/* Adjust Stock Modal */}
          {selectedProduct && (
            <AdjustStockModal
              isOpen={adjustStockOpen}
              product={selectedProduct}
              onClose={() => setAdjustStockOpen(false)}
              onSubmit={handleAdjustStockSubmit}
              isLoading={adjustStockLoading}
            />
          )}

          {/* Product Details Modal */}
          {selectedProduct && (
            <ProductDetailsModal
              isOpen={showDetailsModal}
              product={selectedProduct}
              onClose={() => setShowDetailsModal(false)}
            />
          )}
        </>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <>
          {/* Add Category Button Bar */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleAddCategoryClick}
              className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 shadow-sm"
              style={{ backgroundColor: "#bf262f" }}
            >
              + Add Category
            </button>
          </div>

          {/* Categories Table */}
          <CategoriesTable
            categories={categoriesList}
            emptyMessage="No categories found"
            onEdit={handleEditCategoryClick}
            onDelete={handleDeleteCategoryClick}
          />

          {/* Add/Edit Category Modal */}
          <AddCategoryModal
            isOpen={showAddCategoryModal}
            onClose={handleCloseCategoryModal}
            onSubmit={handleSubmitCategoryModal}
            categoryToEdit={categoryToEdit || undefined}
            isLoading={categoryLoading}
          />

          {/* Delete Category Modal */}
          {selectedCategoryForDelete && (
            <DeleteCategoryModal
              isOpen={deleteDialogOpen}
              categoryName={selectedCategoryForDelete.categoryName}
              onConfirm={handleDeleteCategoryConfirm}
              onCancel={() => setDeleteDialogOpen(false)}
              isLoading={categoryLoading}
            />
          )}
        </>
      )}
    </div>
  );
}
