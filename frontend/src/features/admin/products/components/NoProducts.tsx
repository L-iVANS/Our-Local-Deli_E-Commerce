import { Search } from "lucide-react";

export function NoProducts() {
  return (
    <div className="text-center py-20 text-gray-300">
      <Search size={40} className="mx-auto mb-3" />
      <p className="text-sm">No products found.</p>
    </div>
  );
}
