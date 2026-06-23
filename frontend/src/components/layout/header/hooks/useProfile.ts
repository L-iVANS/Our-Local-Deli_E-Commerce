"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ─────────────────────────────────────────────────────────────
// Type
// ─────────────────────────────────────────────────────────────

/**
 * Shape returned by GET /users/profile.
 *
 * Mirrors UsersTbl columns — sensitive fields (password,
 * createdAt, updatedAt) are intentionally excluded here
 * even if the endpoint leaks them; we simply don't read them.
 */
export interface UserProfile {
  userId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;     // computed by the controller: "first middle last"
  emailAddress: string;
  userName: string;
  address: string;
  phoneNumber: string;
  role: string;
  profPicture?: string; // optional — column has no default
}

// ─────────────────────────────────────────────────────────────
// Fetcher
// ─────────────────────────────────────────────────────────────

/**
 * Fetches the current user's profile.
 *
 * Authentication is handled automatically via the httpOnly
 * JWT cookie (credentials: "include" is set globally in api.ts).
 * The backend reads userId from the JWT — no need to pass it here.
 *
 * Endpoint: GET /users/profile
 * Guard:    JwtAuthGuard (cookie-based)
 */
async function fetchProfile(): Promise<UserProfile> {
  return api.get("users/profile").json<UserProfile>();
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

/**
 * Returns the enriched profile of the currently logged-in user.
 *
 * @param enabled - Pass `false` when the user is not logged in
 *                  to skip the fetch entirely (avoids a 401).
 *
 * Usage:
 *   const { profile, isLoading } = useProfile(isLoggedIn);
 */
export function useProfile(enabled: boolean) {
  const { data, isLoading, isError } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled,                  // only runs when user is logged in
    staleTime: 1000 * 60 * 5, // treat data as fresh for 5 minutes
    retry: 1,                 // one retry on failure, then give up quietly
  });

  return {
    profile: data ?? null,
    isLoading,
    isError,
  };
}