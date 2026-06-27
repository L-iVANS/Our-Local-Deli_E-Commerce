import { Search } from "lucide-react";

export function SearchInput({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...",   // ✅ add this with a default value
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;        // ✅ add this to the type (optional with ?)
}) {
  return (
    <div className="flex-1 relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-muted-foreground pointer-events-none"
      />
      <input
        type="text"
        placeholder={placeholder}    // ✅ use the prop instead of hardcoded text
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-lg border border-gray-200 dark:border-sidebar-border
                   bg-white dark:bg-input-background
                   pl-9 pr-4 py-2.5 text-sm text-foreground
                   placeholder:text-gray-400 dark:placeholder:text-muted-foreground/70
                   transition-all
                   focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}