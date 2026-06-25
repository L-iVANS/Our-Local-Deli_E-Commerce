"use client";

import { useMemo } from "react";
import type { UserProfile } from "@/features/auth/hooks/useAuth";
import type { SessionUser } from "@/lib/session";

interface DisplayInfo {
  displayName: string;
  displayInitial: string;
}

// ✅ Accept either UserProfile or SessionUser (or a partial mix)
type DisplayUser = Partial<UserProfile> & Partial<SessionUser>;

/**
 * Computes a human-friendly display name and initial from the
 * user profile, using multiple fallback strategies.
 *
 * Works with both:
 * - UserProfile (full client-side profile from useAuth)
 * - SessionUser (minimal server-side session)
 */
export function useDisplayName(user: DisplayUser | null): DisplayInfo {
  return useMemo(() => {
    const fullName = user?.fullName;
    const firstName = user?.firstName;
    // ✅ Support both `emailAddress` (UserProfile) and `email` (SessionUser)
    const email =
      (user as any)?.emailAddress ??
      (user as any)?.email;

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