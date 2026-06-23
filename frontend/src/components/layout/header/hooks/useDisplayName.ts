"use client";

import { useMemo } from "react";
import type { UserProfile } from "@/features/auth/hooks/useAuth"; // ← Updated import

interface DisplayInfo {
  displayName: string;
  displayInitial: string;
}

/**
 * Computes a human-friendly display name and initial from the
 * user profile, using multiple fallback strategies.
 */
export function useDisplayName(user: UserProfile | null): DisplayInfo {
  return useMemo(() => {
    const fullName = user?.fullName;
    const firstName = user?.firstName;
    const email = user?.emailAddress;

    const displayName =
      fullName && fullName.trim()
        ? fullName.split(" ")[0]
        : firstName && firstName.trim()
          ? firstName
          : email
            ? email.split("@")[0]
            : "User";

    const displayInitial = displayName.charAt(0).toUpperCase();

    return { displayName, displayInitial };
  }, [user]);
}