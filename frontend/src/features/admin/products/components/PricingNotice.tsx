import Link from "next/link";
import { RED, RED_LIGHT } from "../../../../data/constants";

interface PricingNoticeProps {
  priceType: "retail" | "wholesale" | "bulk";
}

export function PricingNotice({ priceType }: PricingNoticeProps) {
  if (priceType === "retail") return null;

  return (
    <div
      className="rounded-xl px-4 py-2.5 mb-5 flex items-center gap-2 text-xs"
      style={{ backgroundColor: RED_LIGHT }}
    >
      <span style={{ color: RED }} className="font-semibold">
        {priceType === "wholesale" ? "Wholesale" : "Bulk"} pricing shown.
      </span>
      <span className="text-gray-500">
        {priceType === "wholesale" ? "Min. 12 units/SKU — " : "Min. 100 units/SKU — "}
      </span>
      <Link href="/b2b/inquiry" style={{ color: RED }} className="font-semibold underline">
        Apply for access →
      </Link>
    </div>
  );
}
