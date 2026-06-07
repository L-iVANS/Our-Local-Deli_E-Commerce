import { CART_CONFIG } from "../../constants/cartConstants";

interface CostBreakdownProps {
  subtotal: number;
  discountAmount: number;
  discountLabel: string;
  deliveryFee: number;
  grandTotal: number;
  redColor: string;
}

export function CostBreakdown({
  subtotal,
  discountAmount,
  discountLabel,
  deliveryFee,
  grandTotal,
  redColor,
}: CostBreakdownProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
      <div className="flex justify-between text-gray-500">
        <span>Subtotal</span>
        <span>₱{subtotal.toLocaleString()}</span>
      </div>
      {discountAmount > 0 && (
        <div className="flex justify-between text-gray-500">
          <span>Discount ({discountLabel})</span>
          <span className="text-green-600">-₱{discountAmount.toLocaleString()}</span>
        </div>
      )}
      <div className="flex justify-between text-gray-500">
        <span>Delivery</span>
        <span>{deliveryFee === 0 ? "FREE" : `₱${deliveryFee}`}</span>
      </div>
      <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
        <span>Total</span>
        <span style={{ color: "#000000" }}>₱{grandTotal.toLocaleString()}</span>
      </div>
    </div>
  );
}
