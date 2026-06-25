import { BarChart3 } from "lucide-react";
export function BottomBar() {
  return (
    <div className="border-t border-gray-200 w-full bg-[#f8fafc]">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} Omega Houseware Philippines. All rights
          reserved.
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Privacy Policy</span>
          <span>Terms of Use</span>
        </div>
      </div>
    </div>
  );
}
