"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface UserProfile {
  userId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  emailAddress: string;
  userName: string;
  address: string;
  phoneNumber: string;
  role: string;
  profPicture?: string;
}

async function fetchProfile(): Promise<UserProfile> {
  return api.get("users/profile").json<UserProfile>();
}

export function useProfile(enabled: boolean) {
  const { data, isLoading, isError } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled,
    staleTime: 1000 * 60 * 5,          // Fresh for 5 min
    gcTime: 1000 * 60 * 30,             // Keep in memory 30 min
    refetchOnMount: false,              // ✅ Don't refetch on every mount
    refetchOnWindowFocus: false,        // ✅ Don't refetch on tab focus
    refetchOnReconnect: false,          // ✅ Don't refetch on reconnect
    retry: 1,
  });

  return {
    profile: data ?? null,
    isLoading,
    isError,
  };
}