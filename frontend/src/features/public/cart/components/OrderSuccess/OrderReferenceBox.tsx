const RED = "#bf262f";
const RED_LIGHT = "#fef3f2";

interface OrderReferenceBoxProps {
  orderNumber: string;
}

export function OrderReferenceBox({ orderNumber }: OrderReferenceBoxProps) {
  return (
    <div
      className="rounded-xl p-4 mb-6"
      style={{ backgroundColor: RED_LIGHT }}
    >
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Reference</div>
      <div
        className="font-bold text-lg"
        style={{ fontFamily: "'Playfair Display', serif", color: RED }}
      >
        {orderNumber}
      </div>
      <div className="text-gray-400 text-xs mt-0.5">Save this for tracking purposes</div>
    </div>
  );
}
