import { Company } from "../types";

export type CartAuthCompany = Company & {
  userId?: number;
  companyName?: string;
  emailAddress?: string;
  fullName?: string;
  phoneNumber?: string;
  tier?: string;
  name?: string;
  email?: string;
  accountNumber?: string;
  contactPerson?: string;
};

export const normalizeCompany = (authCompany: CartAuthCompany | null): Company => {
  const tier = authCompany?.tier || "Standard";

  return {
    ...authCompany,
    tier,
    name: authCompany?.companyName || authCompany?.name || "Your Company",
    email: authCompany?.emailAddress || authCompany?.email || "",
    accountNumber: authCompany?.accountNumber || "",
    contactPerson: authCompany?.contactPerson || authCompany?.fullName || "",
    address: authCompany?.address || "", // Explicitly map address from UsersTbl
  } as Company;
};
