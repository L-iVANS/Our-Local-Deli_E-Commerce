import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
}

export const PasswordField = ({
  value,
  onChange,
  showPassword,
  toggleShowPassword,
}: PasswordFieldProps) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Password
      </label>
      <a href="#" className="text-xs" style={{ color: "#bf262f" }}>
        Forgot password?
      </a>
    </div>
    <div className="relative">
      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
      <input
        type={showPassword ? "text" : "password"}
        required
        placeholder="••••••••"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-400 transition-colors bg-gray-50/50"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);
