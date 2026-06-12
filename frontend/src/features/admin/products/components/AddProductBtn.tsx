import { Plus } from "lucide-react";

export function AddProductBtn({setShowAddProductModal}: {setShowAddProductModal: (value: boolean) => void}) {
  return (
    <button
        onClick={() => setShowAddProductModal(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 shadow-sm"
        style={{ backgroundColor: "#bf262f" }}
    >
        <Plus size={14} />
        Add Product
    </button>
  );
}