import { Mail } from "lucide-react";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const EmailField = ({ value, onChange }: EmailFieldProps) => (
  <div>
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
      Email Address
    </label>
    <div className="relative">
      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-400 transition-colors bg-gray-50/50"
      />
    </div>
  </div>
);
