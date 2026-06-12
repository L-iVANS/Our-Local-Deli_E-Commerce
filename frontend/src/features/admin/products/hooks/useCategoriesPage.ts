import { useState } from "react";
import { useGetCategories } from "./service-hooks/use-getcategories";
import { useCreateCategory } from "./service-hooks/use-createcategory";
import { useUpdateCategory } from "./service-hooks/use-updatecategory";
import { useDeleteCategory } from "./service-hooks/use-deletecategory";
import { CategoryFormData } from "../components/AddCategoryModal";
import { Category } from "../components/CategoriesTable";
import { toast } from "sonner";

export function useCategoriesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const { data, isLoading: fetchLoading, error } = useGetCategories();

  // Mutations - React Query returns an object, NOT an array
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const categories: Category[] = data || [];

  const handleAddCategory = (formData: CategoryFormData) => {
    setLoading(true);
    createCategory
      .mutateAsync({
        categoryName: formData.categoryName,
        slug: formData.slug,
        skuPrefix: formData.skuPrefix,
      })
      .then(() => {
        toast.success("Category created successfully!");
        setShowAddModal(false);
      })
      .catch((err) => {
        console.error("Error creating category:", err);
        const errorMessage = err?.message || "Failed to create category.";
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEditClick = (category: Category) => {
    setCategoryToEdit(category);
    setShowAddModal(true);
  };

  const handleEditCategory = (formData: CategoryFormData) => {
    if (!categoryToEdit) return;

    setLoading(true);
    updateCategory
      .mutateAsync({
        id: categoryToEdit.categoryId,
        input: {
          categoryName: formData.categoryName,
          slug: formData.slug,
          skuPrefix: formData.skuPrefix,
        },
      })
      .then(() => {
        toast.success("Category updated successfully!");
        setShowAddModal(false);
        setCategoryToEdit(null);
      })
      .catch((err) => {
        console.error("Error updating category:", err);
        const errorMessage = err?.message || "Failed to update category.";
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedCategory) return;

    setLoading(true);
    deleteCategory
      .mutateAsync(selectedCategory.categoryId)
      .then(() => {
        toast.success("Category deleted successfully!");
        setDeleteDialogOpen(false);
        setSelectedCategory(null);
      })
      .catch((err) => {
        const errorMessage = err?.message || "Failed to delete category.";
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setCategoryToEdit(null);
  };

  const handleSubmitModal = (formData: CategoryFormData) => {
    if (categoryToEdit) {
      handleEditCategory(formData);
    } else {
      handleAddCategory(formData);
    }
  };

  return {
    // State
    showAddModal,
    setShowAddModal,
    categoryToEdit,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedCategory,
    loading,
    // Data
    categories,
    fetchLoading,
    error,
    // Handlers
    handleAddClick: () => {
      setCategoryToEdit(null);
      setShowAddModal(true);
    },
    handleEditClick,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCloseModal,
    handleSubmitModal,
  };
}