import { TrendingUp, Package, AlertTriangle,Zap} from "lucide-react";


export function ProductsCard({totalItems, totalUnits, inTransitUnits, lowStockCount}: {totalItems: number, totalUnits: number, inTransitUnits: number, lowStockCount: number}) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Products",
            value: totalItems,
            icon: Package,
            color: "#bf262f",
            bg: "#fdf2f2",
          },
          {
            label: "Total Units",
            value: totalUnits,
            icon: TrendingUp,
            color: "#2563eb",
            bg: "#eff6ff",
          },
          {
            label: "In Transit",
            value: inTransitUnits,
            icon: Zap,
            color: "#d97706",
            bg: "#fffbeb",
          },
          {
            label: "Below Reorder",
            value: lowStockCount,
            icon: AlertTriangle,
            color: "#dc2626",
            bg: "#fef2f2",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-xs">{label}</span>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <div
              className="font-bold"
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                lineHeight: 1.2,
                color,
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
    );
}