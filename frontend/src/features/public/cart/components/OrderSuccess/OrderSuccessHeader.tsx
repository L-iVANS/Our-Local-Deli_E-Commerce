import { CheckCircle2 } from "lucide-react";

const RED = "#bf262f";

export function OrderSuccessHeader() {
  return (
    <div className="text-center mb-6">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ backgroundColor: "#ecfdf5" }}
      >
        <CheckCircle2 size={30} className="text-green-600" />
      </div>

      <h1
        className="text-gray-900 mb-2"
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.6rem" }}
      >
        Order Placed!
      </h1>
      <p className="text-gray-400 text-sm leading-relaxed">
        Your order has been received and is being processed. You'll receive a confirmation email shortly.
      </p>
    </div>
  );
}
