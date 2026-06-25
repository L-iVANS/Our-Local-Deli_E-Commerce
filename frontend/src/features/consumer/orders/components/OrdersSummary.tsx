interface SummaryItem {
  label: string;
  value: string;
  color: string;
  bg: string;
}

interface OrdersSummaryProps {
  items: SummaryItem[];
}

export function OrdersSummary({ items }: OrdersSummaryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map(({ label, value, color, bg }) => (
        <div
          key={label}
          className="bg-white rounded-xl border p-4"
          style={{ borderColor: "#e2e8f0" }}
        >
          <div className="text-gray-500 text-xs mb-1">{label}</div>
          <div className="font-bold text-gray-800" style={{ fontSize: "1.2rem" }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
