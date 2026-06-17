import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { GET_ME, ReadProfileData } from "@/features/auth/services/query";
import { Company } from "../types";

/**
 * Hook to fetch and enrich company profile with full data including address
 * This ensures address from the database is available for delivery forms
 */
export const useEnrichedCompanyProfile = () => {
  const { company: authCompany } = useAuth();
  const [enrichedCompany, setEnrichedCompany] = useState<Company | null>(authCompany || null);

  // Fetch full profile data from backend
  const { data: profileData, loading } = useQuery<ReadProfileData>(GET_ME, {
    skip: !authCompany?.userId,
  });

  useEffect(() => {
    if (!authCompany) {
      setEnrichedCompany(null);
      return;
    }

    // If we have full profile data, merge it with auth company
    if (profileData?.readProfile) {
      setEnrichedCompany({
        ...authCompany,
        address: profileData.readProfile.address || authCompany.address || "",
        companyName: profileData.readProfile.companyName || authCompany.companyName || "",
        phoneNumber: profileData.readProfile.phoneNumber || authCompany.phoneNumber || "",
        firstName: profileData.readProfile.fullName?.split(" ")[0] || authCompany.firstName || "",
        lastName: profileData.readProfile.fullName?.split(" ").slice(1).join(" ") || authCompany.lastName || "",
      });
    } else {
      setEnrichedCompany(authCompany);
    }
  }, [authCompany, profileData]);

  return { company: enrichedCompany, loading };
};
