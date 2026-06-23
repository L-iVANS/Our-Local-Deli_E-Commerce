"use client";

import React from "react";

interface UserBadgeProps {
  displayName: string;
  displayInitial: string;
}

/**
 * User avatar badge showing initials and name.
 */
export function UserBadge({ displayName, displayInitial }: UserBadgeProps) {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
        {displayInitial}
      </div>
      <span className="hidden md:block text-sm font-medium text-foreground">
        {displayName}
      </span>
    </div>
  );
}