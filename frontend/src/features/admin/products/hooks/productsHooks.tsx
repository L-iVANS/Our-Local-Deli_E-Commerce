import { useState } from "react";
import { useProducts } from "../hooks/service-hooks/use-products";
import { AddProductModal } from "@/features/admin/products/components/AddProductModal";
import { type ProductFormData } from "@/features/admin/products/utils/validation";
import { toast } from "sonner";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  categoryId: number;
  available: number;
  inTransit: number;
  blocked: number;
  reorderPoint: number;
  status: string;
  price: number;
}

export function useProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<(ProductFormData & { productId: number }) | null>(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [adjustStockOpen, setAdjustStockOpen] = useState(false);
  const [adjustStockLoading, setAdjustStockLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch from GraphQL
  const { data, isLoading: loading, error } = useProducts();

  // Transform data directly (no useEffect needed)
  interface BackendProduct {
    productId: number;
    productName: string;
    sku: string;
    categoryId: number;
    category?: {
      categoryName: string;
    } | null;
    available: number;
    inTransit: number;
    blocked: number;
    reorderPoint: number;
    productPrice: number;
  }

  const products: Product[] = (data || []).map((product: BackendProduct) => {
    const available = product.available || 0;
    const reorderPoint = product.reorderPoint || 50;
    let status = "Active";
    
    if (available === 0) {
      status = "Out of Stock";
    } else if (available <= reorderPoint) {
      status = "Low Stock";
    }

    return {
      id: product.productId.toString(),
      sku: product.sku || `SKU-${product.productId}`,
      name: product.productName,
      category: product.category?.categoryName || "Uncategorized",
      categoryId: product.categoryId,
      available,
      inTransit: product.inTransit || 0,
      blocked: product.blocked || 0,
      reorderPoint,
      status,
      price: product.productPrice,
    };
  });

  const totalItems = products.length;
  const totalUnits = products.reduce((sum, p) => sum + p.available, 0);
  const inTransitUnits = products.reduce((sum, p) => sum + p.inTransit, 0);
  const lowStockCount = products.filter((p) => p.available <= p.reorderPoint).length;

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const statuses = ["all", "Active", "Low Stock", "Out of Stock"];

  // Action handlers
  const handleAddProduct = (formData: ProductFormData) => {
    console.log("Product added:", formData);
    // TODO: Call createProduct mutation to add to backend
    // The GraphQL cache will auto-update
  };

  const handleEdit = (product: Product) => {
    setProductToEdit({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      reorderPoint: product.reorderPoint,
      available: product.available,
      productDescription: "",
      image: null,
      productId: parseInt(product.id),
    });
    setShowAddProductModal(true);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleAdjustStock = (product: Product) => {
    setSelectedProduct(product);
    setAdjustStockOpen(true);
  };

  const handleAdjustStockSubmit = async (data: { available: number; inTransit: number; blocked: number }) => {
    setAdjustStockLoading(false);
    setAdjustStockOpen(false);
  };

  const handleArchive = (product: Product) => {
    setSelectedProduct(product);
    setArchiveDialogOpen(true);
  };

  const handleArchiveConfirm = async () => {
    setArchiveLoading(true);
    try {
      console.log("Archiving product:", selectedProduct?.name);
      // TODO: Call archiveProduct mutation with refetchQueries: ["GetProducts"]
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Product archived successfully!");
      setArchiveDialogOpen(false);
      // When you implement the real mutation, add: refetchQueries: ["GetProducts"]
    } catch (error) {
      console.error("Failed to archive product:", error);
      toast.error("Failed to archive product");
    } finally {
      setArchiveLoading(false);
    }
  };

  return {
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
    products,
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
  };
}