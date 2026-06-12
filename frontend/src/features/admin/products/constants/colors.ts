// Brand & Primary Colors
export const COLORS = {
  // Brand - Red
  brandPrimary: "#bf262f",
  brandSecondary: "#dc2626",
  
  // Backgrounds & Surfaces
  bgLight: "#fdf2f2",
  bgLighter: "#fef2f2",
  bgNeutral: "#f8fafc",
  bgBorder: "#f1f5f9",
  
  // Text Colors
  textDark: "#0f172a",
  textPrimary: "#4b5563",
  textSecondary: "#64748b",
  textTertiary: "#94a3b8",
  
  // Borders
  borderDefault: "#e2e8f0",
  
  // Status Colors
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#2563eb",
  
  // Semantic
  error: "#dc2626",
  disabled: "#94a3b8",
  
  // Overlay
  backdrop: "rgba(0, 0, 0, 0.5)",
} as const;

// Color variants for focus states
export const FOCUS_COLORS = {
  ring: "#fee2e2",    // light red
  border: "#fca5a5", // medium red
} as const;
