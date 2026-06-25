import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { OrderTabStatus } from "../types/order";
import { STATUS_TABS } from "../constants/orderConfig";

interface OrdersFilterProps {
  activeTab: OrderTabStatus;
  setActiveTab: (tab: OrderTabStatus) => void;
  search: string;
  setSearch: (search: string) => void;
  counts: Record<OrderTabStatus, number>;
}

export function OrdersFilter({
  activeTab,
  setActiveTab,
  search,
  setSearch,
  counts,
}: OrdersFilterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTabChange = (tab: OrderTabStatus) => {
    setActiveTab(tab);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className="bg-white rounded-xl border"
      style={{ borderColor: "#e2e8f0" }}
    >
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-3 gap-4"
        style={{ borderBottom: "1px solid #f1f5f9" }}
      >
        {/* Mobile Dropdown */}
        <div className="relative sm:hidden">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all w-full"
            style={{
              backgroundColor: "#bf262f",
              color: "#fff",
              borderColor: "#e2e8f0",
            }}
          >
            <span>{activeTab}</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10"
              style={{ borderColor: "#e2e8f0" }}
            >
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className="flex items-center justify-between gap-2 w-full px-3.5 py-2 text-xs font-medium transition-colors hover:bg-gray-50"
                  style={{
                    color: activeTab === tab ? "#bf262f" : "#6b7280",
                    fontWeight: activeTab === tab ? "600" : "500",
                    borderBottom: tab !== STATUS_TABS[STATUS_TABS.length - 1] ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  <span>{tab}</span>
                  <span
                    className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: activeTab === tab ? "#fee2e2" : "#f1f5f9",
                      color: activeTab === tab ? "#bf262f" : "#6b7280",
                      fontSize: "0.62rem",
                    }}
                  >
                    {counts[tab]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Tabs */}
        <div className="hidden sm:flex items-center gap-1 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
              style={{
                backgroundColor: activeTab === tab ? "#bf262f" : "transparent",
                color: activeTab === tab ? "#fff" : "#6b7280",
              }}
            >
              {tab}
              <span
                className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor:
                    activeTab === tab ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                  color: activeTab === tab ? "#fff" : "#6b7280",
                  fontSize: "0.62rem",
                }}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-auto">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search order or SAP#…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto pl-8 pr-3 py-2 rounded-lg border text-xs focus:outline-none transition-all"
            style={{ borderColor: "#e2e8f0", fontSize: "0.78rem" }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#bab9b9";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          />
        </div>
      </div>
    </div>
  );
}
