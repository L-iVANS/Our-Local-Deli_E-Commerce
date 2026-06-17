"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";

const BLUE_COLOR = "#3b82f6";
const BLUE_LIGHT = "rgba(59, 130, 246, 0.1)";

interface ConfirmCheckboxProps {
  confirmed: boolean;
  onConfirmedChange: (value: boolean) => void;
  showError?: boolean;
}

export function ConfirmCheckbox({
  confirmed,
  onConfirmedChange,
  showError = false,
}: ConfirmCheckboxProps) {
  const { company } = useAuth();
  const companyName = company?.companyName || company?.fullName || "your company";
  
  const isError = showError && !confirmed;

  return (
    <div>
      <label
        className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all"
        style={{
          borderColor: isError ? "#ef4444" : confirmed ? BLUE_COLOR : "#e5e7eb",
          backgroundColor: isError ? "rgba(239, 68, 68, 0.05)" : confirmed ? BLUE_LIGHT : "#fafafa",
        }}
      >
      <input
        type="checkbox"
        checked={confirmed}
        onChange={(e) => onConfirmedChange(e.target.checked)}
        className="h-3 w-3 shrink-0 accent-blue-600 cursor-pointer flex item-center justify-center mt-[3%]"
      />
      <span className="text-xs text-gray-600 leading-relaxed">
        I confirm this order is correct. I understand the pricing tier, MOQ requirements,
        and delivery terms for <strong>{companyName}</strong>.
      </span>
    </label>
    {isError && (
      <p className="text-xs text-red-600 mt-2 font-medium">
        This field is required
      </p>
    )}
    </div>
  );
}
