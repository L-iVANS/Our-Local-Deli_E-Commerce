import { Filter } from "lucide-react";


export function FilterDropdown({searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory, statuses, selectedStatus, setSelectedStatus, showFilterDropdown, setShowFilterDropdown}:
     {searchTerm: string, setSearchTerm: (value: string) => void, categories: string[], selectedCategory: string, setSelectedCategory: (value: string) => void, statuses: string[],
         selectedStatus: string, setSelectedStatus: (value: string) => void, showFilterDropdown: boolean, setShowFilterDropdown: (value: boolean) => void}) {
    return(
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Filter size={14} />
            Filter
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 space-y-4">
              {/* Category Filter */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="px-3 py-2 rounded-lg text-xs font-medium transition-all text-left"
                      style={{
                        backgroundColor:
                          selectedCategory === cat ? "#fdf2f2" : "#f9fafb",
                        color:
                          selectedCategory === cat ? "#bf262f" : "#6b7280",
                        border:
                          selectedCategory === cat
                            ? "1px solid #bf262f"
                            : "1px solid #e5e7eb",
                      }}
                    >
                      {cat === "all" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className="px-3 py-2 rounded-lg text-xs font-medium transition-all text-left"
                      style={{
                        backgroundColor:
                          selectedStatus === status ? "#fdf2f2" : "#f9fafb",
                        color:
                          selectedStatus === status ? "#bf262f" : "#6b7280",
                        border:
                          selectedStatus === status
                            ? "1px solid #bf262f"
                            : "1px solid #e5e7eb",
                      }}
                    >
                      {status === "all" ? "All Status" : status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                }}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
    );
}