import { Plus } from "lucide-react";

export function AddProductBtn({
  setShowAddProductModal,
}: {
  setShowAddProductModal: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => setShowAddProductModal(true)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg
                 bg-primary text-[#F4F4F0] text-sm font-semibold
                 shadow-sm transition-all
                 hover:bg-primary/90 hover:shadow-md
                 focus:outline-none focus:ring-2 focus:ring-primary/30
                 active:scale-[0.98]"
    >
      <Plus size={14} />
      Add Product
    </button>
  );
}