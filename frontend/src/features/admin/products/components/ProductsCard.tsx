import { TrendingUp, Package, AlertTriangle, Zap } from "lucide-react";

export function ProductsCard({
  totalItems,
  totalUnits,
  inTransitUnits,
  lowStockCount,
}: {
  totalItems: number;
  totalUnits: number;
  inTransitUnits: number;
  lowStockCount: number;
}) {
  // ✅ Dynamic alert for low stock (only card that's truly semantic)
  const hasLowStock = lowStockCount > 0;

  const cards = [
    {
      label: "Total Products",
      value: totalItems,
      icon: Package,
      // brand green
      iconBg: "bg-primary/10 dark:bg-primary/25",
      iconColor: "text-primary dark:text-gold-light",
      valueColor: "text-primary dark:text-gold-light",
    },
    {
      label: "Total Units",
      value: totalUnits,
      icon: TrendingUp,
      // brand green
      iconBg: "bg-primary/10 dark:bg-primary/25",
      iconColor: "text-primary dark:text-gold-light",
      valueColor: "text-primary dark:text-gold-light",
    },
    {
      label: "In Transit",
      value: inTransitUnits,
      icon: Zap,
      // gold (premium "in motion")
      iconBg: "bg-accent/15 dark:bg-accent/25",
      iconColor: "text-accent dark:text-gold-light",
      valueColor: "text-accent dark:text-gold-light",
    },
    {
      label: "Below Reorder",
      value: lowStockCount,
      icon: AlertTriangle,
      // dynamic: red ONLY if there's an actual problem
      iconBg: hasLowStock
        ? "bg-red-50 dark:bg-red-950/30"
        : "bg-primary/10 dark:bg-primary/25",
      iconColor: hasLowStock
        ? "text-red-600 dark:text-red-400"
        : "text-primary dark:text-gold-light",
      valueColor: hasLowStock
        ? "text-red-600 dark:text-red-400"
        : "text-primary dark:text-gold-light",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, iconBg, iconColor, valueColor }) => (
        <div
          key={label}
          className="rounded-xl p-4 transition-all
                     bg-white dark:bg-card
                     border border-gray-100 dark:border-sidebar-border
                     shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 dark:text-muted-foreground">
              {label}
            </span>
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}
            >
              <Icon size={16} className={iconColor} />
            </div>
          </div>
          <div className={`font-display text-2xl font-bold leading-tight ${valueColor}`}>
            {value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}