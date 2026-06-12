import { Search } from "lucide-react";

export function SearchInput({searchTerm, setSearchTerm}: {searchTerm: string, setSearchTerm: (value: string) => void}) {
    return (
        <div className="flex-1 relative">
            <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
            type="text"
            placeholder="Search by name or SKU..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all"
            style={{ borderColor: "#e5e7eb" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

    );
}