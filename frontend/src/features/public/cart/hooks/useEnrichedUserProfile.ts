// src/features/public/cart/hooks/useEnrichedUserProfile.ts

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { profileService } from '@/features/auth/services/profile-service';
import { UserProfile } from '@/features/auth/hooks/useAuth'; // or wherever UserProfile is exported from

/**
 * Hook to fetch and enrich user profile with full data including address.
 * Replaces the previous Apollo GraphQL GET_ME query with a REST call to GET /users/profile.
 * The auth context only carries session-level data (userId, email, role).
 * This hook fills in the missing fields: address, phoneNumber, firstName, lastName, fullName.
 */
export const useEnrichedUserProfile = () => {
  const { user: authUser } = useAuth();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['user-profile', authUser?.userId],
    queryFn: profileService.getProfile,
    enabled: !!authUser?.userId,     // only fetch if user is logged in
    staleTime: 5 * 60 * 1000,        // cache for 5 minutes — profile rarely changes
  });

  // If no auth session, return null immediately
  if (!authUser) {
    return { user: null, loading: false };
  }

  // Merge auth session data with full profile from backend
  const enrichedUser: UserProfile = {
    ...authUser,
    address:     profileData?.address     || authUser.address     || '',
    phoneNumber: profileData?.phoneNumber || authUser.phoneNumber || '',
    firstName:   profileData?.firstName   || authUser.firstName   || '',
    lastName:    profileData?.lastName    || authUser.lastName    || '',
    fullName:    profileData?.fullName    || authUser.fullName    || '',
  };

  return { user: enrichedUser, loading: isLoading };
};