import { Grid, List } from "lucide-react";
import { SearchBar } from "../../../../components/ui/SearchBar";
import { DropdownFilter } from "../../../../components/ui/DropdownFilter";
import { CATEGORIES, SORT_OPTIONS, RED } from "../../../../data/constants";

interface FilterBarProps {
  activeCategory: string;
  search: string;
  sort: string;
  viewMode: "grid" | "list";
  priceType: "retail" | "wholesale" | "bulk";
  onCategoryChange: (cat: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onPriceTypeChange: (type: "retail" | "wholesale" | "bulk") => void;
}

export function FilterBar({
  activeCategory,
  search,
  sort,
  viewMode,
  priceType,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onViewModeChange,
  onPriceTypeChange,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-col gap-3">
      {/* Search bar with sort dropdown */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Search products…"
          />
        </div>
        {/* Sort dropdown */}
        <div className="shrink-0">
          <DropdownFilter
            value={sort}
            options={SORT_OPTIONS}
            onChange={onSortChange}
          />
        </div>
      </div>

      {/* Categories and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={
                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ` +
                (activeCategory === cat
                  ? "bg-gray-300 text-gray-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-300 hover:text-gray-800")
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pricing type and View buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Pricing type */}
          {/* <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs">
            {(["retail", "wholesale", "bulk"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onPriceTypeChange(t)}
                className="px-3 py-1.5 capitalize font-semibold transition-colors"
                style={priceType === t ? { backgroundColor: RED, color: "#fff" } : { color: "#374151" }}
              >
                {t}
              </button>
            ))}
          </div> */}
          {/* View */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            {([["grid", Grid], ["list", List]] as const).map(([mode, Icon]) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className="p-1.5 transition-colors"
                style={viewMode === mode ? { backgroundColor: RED, color: "#fff" } : { color: "#9ca3af" }}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
