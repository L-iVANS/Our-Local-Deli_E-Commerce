// src/features/public/cart/hooks/useEnrichedCompanyProfile.ts

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { profileService } from '@/features/auth/services/profile-service';
import { Company } from '../types';

/**
 * Hook to fetch and enrich company profile with full data including address.
 * Replaces the previous Apollo GraphQL GET_ME query with a REST call to GET /users/profile.
 * The auth context only carries session-level data (userId, email, role).
 * This hook fills in the missing fields: address, companyName, phoneNumber, fullName.
 */
export const useEnrichedCompanyProfile = () => {
  const { company: authCompany } = useAuth();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['user-profile', authCompany?.userId],
    queryFn: profileService.getProfile,
    enabled: !!authCompany?.userId,  // only fetch if user is logged in
    staleTime: 5 * 60 * 1000,        // cache for 5 minutes — profile rarely changes
  });

  // If no auth session, return null immediately
  if (!authCompany) {
    return { company: null, loading: false };
  }

  // Merge auth session data with full profile from backend
  const enrichedCompany: Company = {
    ...authCompany,
    address:     profileData?.address     || authCompany.address     || '',
    companyName: profileData?.companyName || authCompany.companyName || '',
    phoneNumber: profileData?.phoneNumber || authCompany.phoneNumber || '',
    firstName:   profileData?.firstName   || authCompany.firstName   || '',
    lastName:    profileData?.lastName    || authCompany.lastName    || '',
    fullName:    profileData?.fullName    || authCompany.fullName    || '',
  };

  return { company: enrichedCompany, loading: isLoading };
};