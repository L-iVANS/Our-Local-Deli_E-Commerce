interface RememberMeFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const RememberMeField = ({ checked, onChange }: RememberMeFieldProps) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      id="remember"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="accent-red-600"
    />
    <label htmlFor="remember" className="text-sm text-gray-500">
      Keep me signed in
    </label>
  </div>
);
