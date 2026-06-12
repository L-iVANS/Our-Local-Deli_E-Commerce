import React from "react";
import { COLORS } from "../constants/colors";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "number" | "email" | "password" | "select";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  min?: string | number;
  step?: string | number;
  maxLength?: number;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  showCharCount?: boolean;
  maxChars?: number;
  disabled?: boolean;
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  onKeyDown,
  error,
  placeholder,
  min,
  step,
  maxLength,
  options,
  required = false,
  showCharCount = false,
  maxChars,
  disabled = false,
}: FormFieldProps) {
  const hasError = !!error;
  const charCount = showCharCount && maxChars ? String(value).length : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={name}
          className="block text-sm font-semibold"
          style={{ color: COLORS.textPrimary }}
        >
          {label}
          {required && <span style={{ color: COLORS.danger }}>*</span>}
        </label>
        {showCharCount && maxChars && (
          <span className="text-xs" style={{ color: COLORS.textTertiary }}>
            {charCount}/{maxChars}
          </span>
        )}
      </div>

      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
          style={{
            borderColor: hasError ? COLORS.error : COLORS.borderDefault,
            backgroundColor: disabled ? COLORS.bgNeutral : "white",
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <option value="">Select an option</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          min={min}
          step={step}
          className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all"
          style={{
            borderColor: hasError ? COLORS.error : COLORS.borderDefault,
            backgroundColor: COLORS.bgNeutral,
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
      )}

      {error && (
        <p className="text-xs mt-1" style={{ color: COLORS.error }}>
          {error}
        </p>
      )}
    </div>
  );
}
