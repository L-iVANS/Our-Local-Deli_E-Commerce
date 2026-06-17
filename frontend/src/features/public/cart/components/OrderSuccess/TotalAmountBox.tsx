const GRAY = "#d1d5db";

interface TotalAmountBoxProps {
  grandTotal: number;
}

export function TotalAmountBox({ grandTotal }: TotalAmountBoxProps) {
  if (grandTotal <= 0) return null;

  return (
    <div
      className="rounded-xl p-4 mb-6 border-2"
      style={{ backgroundColor: "#ffffff", borderColor: GRAY }}
    >
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold">
        Total Amount Due
      </div>
      <div className="flex items-baseline justify-between">
        <div
          className="font-bold text-3xl"
          style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
        >
          ₱{grandTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      <div className="text-gray-400 text-xs mt-2">Please pay this amount via bank transfer</div>
    </div>
  );
}
