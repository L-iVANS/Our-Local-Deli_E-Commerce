"use client";

interface StatCard {
  value: string;
  label: string;
}

const STAT_CARDS: StatCard[] = [
  { value: "500+", label: "SKUs" },
  { value: "35%", label: "Max Off" },
  { value: "24h", label: "Fulfillment" },
];

export const LoginLeftPanel = () => {
  return (
    <div
      className="hidden lg:flex flex-col justify-between w-[45%] p-14 text-[#F4F4F0] relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #0A3A2B 0%, #165a45 60%, #0d4434 100%)",
      }}
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A8844C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Accent gradient overlay for depth */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background:
            "radial-gradient(circle at top right, #A8844C 0%, transparent 70%)",
        }}
      />

      {/* Main Content Section */}
      <div className="relative flex flex-col items-left justify-center h-full">
        <div className="text-left max-w-sm">
          <p className="text-[#A8844C] text-xs uppercase tracking-widest mb-4 font-medium">
            Trusted by 1,200+ businesses
          </p>
          <h2
            className="text-4xl font-bold leading-tight mb-6 text-[#F4F4F0]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Supply smarter.
            <br />
            Sell everywhere.
          </h2>
          <p className="text-[#F4F4F0]/70 text-sm leading-relaxed mb-10">
            Access exclusive B2B pricing, manage orders, and sync your
            inventory across Shopee, Lazada, and TikTok Shop — all from one
            portal.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            {STAT_CARDS.map(({ value, label }) => (
              <div
                key={label}
                className="border border-[#A8844C]/20 rounded-2xl p-4 text-center bg-[#0A3A2B]/30 backdrop-blur-sm hover:border-[#A8844C]/40 transition-colors"
              >
                <div
                  className="text-2xl font-bold text-[#A8844C]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {value}
                </div>
                <div className="text-[#F4F4F0]/50 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};