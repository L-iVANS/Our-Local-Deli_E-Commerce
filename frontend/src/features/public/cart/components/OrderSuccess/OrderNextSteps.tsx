import { CheckCircle2, Package, Clock } from "lucide-react";

const RED = "#bf262f";

export function OrderNextSteps() {
  const steps = [
    {
      icon: CheckCircle2,
      color: "#16a34a",
      step: "Order confirmed",
      sub: "Our team will verify your order details.",
    },
    {
      icon: Package,
      color: RED,
      step: "Picking & packing",
      sub: "Items are prepared at our warehouse.",
    },
    {
      icon: Clock,
      color: "#2563eb",
      step: "Dispatched for delivery",
      sub: "You'll receive tracking details via email.",
    },
  ];

  return (
    <div className="text-left space-y-3 mb-7">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        What happens next
      </div>
      {steps.map(({ icon: Icon, color, step, sub }) => (
        <div key={step} className="flex items-start gap-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon size={13} style={{ color }} />
          </div>
          <div>
            <div className="text-gray-800 text-sm font-medium">{step}</div>
            <div className="text-gray-400 text-xs">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
