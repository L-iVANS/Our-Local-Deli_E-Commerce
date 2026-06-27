import { Filter } from "lucide-react";

export interface FilterSection {
  label: string;                              // e.g. "Status", "Category"
  options: string[];                          // e.g. ["all", "PENDING", "ACCEPT"]
  selected: string;                           // currently selected value
  onChange: (value: string) => void;          // setter
  getLabel?: (value: string) => string;       // optional: format option labels
  allLabel?: string;                          // optional: label for "all" option
}

interface FilterDropdownProps {
  sections: FilterSection[];                  // 1 or more filter sections
  showFilterDropdown: boolean;
  setShowFilterDropdown: (value: boolean) => void;
  onClearAll?: () => void;                    // optional clear handler
}

export function FilterDropdown({
  sections,
  showFilterDropdown,
  setShowFilterDropdown,
  onClearAll,
}: FilterDropdownProps) {
  // Chip styling
  const chipClass = (active: boolean) =>
    [
      "px-3 py-2 rounded-lg text-xs font-medium transition-all text-left border",
      active
        ? "bg-primary/15 text-primary border-primary dark:bg-primary/20 dark:text-gold-light dark:border-gold"
        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-card dark:text-muted-foreground dark:border-sidebar-border dark:hover:bg-sidebar-accent",
    ].join(" ");

  // Default clear: reset all sections to "all"
  const handleClear = () => {
    if (onClearAll) {
      onClearAll();
    } else {
      sections.forEach((section) => section.onChange("all"));
    }
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg
                   border border-gray-200 dark:border-sidebar-border
                   bg-white dark:bg-card
                   text-sm font-medium text-gray-600 dark:text-muted-foreground
                   transition-colors
                   hover:bg-gray-50 dark:hover:bg-sidebar-accent
                   focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <Filter size={14} />
        Filter
      </button>

      {/* Dropdown */}
      {showFilterDropdown && (
        <div
          className="absolute right-0 mt-2 w-80 z-10 p-4 space-y-4
                     rounded-lg shadow-lg
                     bg-white dark:bg-card
                     border border-gray-200 dark:border-sidebar-border"
        >
          {sections.map((section) => (
            <div key={section.label}>
              <label className="text-xs font-semibold mb-2 block text-gray-700 dark:text-gold">
                {section.label}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {section.options.map((option) => {
                  const isAll = option === "all";
                  const displayLabel = isAll
                    ? section.allLabel ?? `All ${section.label}`
                    : section.getLabel
                    ? section.getLabel(option)
                    : option;

                  return (
                    <button
                      key={option}
                      onClick={() => section.onChange(option)}
                      className={chipClass(section.selected === option)}
                    >
                      {displayLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Clear Filters */}
          <button
            onClick={handleClear}
            className="w-full px-3 py-2 rounded-lg text-xs font-medium
                       text-gray-600 hover:bg-gray-100
                       dark:text-muted-foreground dark:hover:bg-sidebar-accent
                       transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}