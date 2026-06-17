"use client";

import { LucideIcon } from "lucide-react";

interface WarningProps {
  icon: LucideIcon;
  color: string;
  bg: string;
  children: React.ReactNode;
}

export function Warning({ icon: Icon, color, bg, children }: WarningProps) {
  return (
    <div
      className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-xs leading-relaxed"
      style={{ backgroundColor: bg, color }}
    >
      <Icon size={14} className="flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}
