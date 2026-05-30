"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { SessionUser } from "@/src/lib/session";

export interface CompanyProfile {
  userId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  emailAddress: string;
  companyName: string;
  address: string;
  phoneNumber: string;
  role: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  company: CompanyProfile | null;
  login: (userData: CompanyProfile) => void;
  logout: () => void;
}

function createCompanyProfileFromSession(session: SessionUser): CompanyProfile {
  const guessedName = session.emailAddress.split("@")[0] || "User";

  return {
    userId: session.userId,
    firstName: guessedName,
    middleName: "",
    lastName: "",
    fullName: guessedName,
    emailAddress: session.emailAddress,
    companyName: "",
    address: "",
    phoneNumber: "",
    role: session.role,
  };
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  company: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({
  children,
  initialSession = null,
}: {
  children: ReactNode;
  initialSession?: SessionUser | null;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(initialSession));
  const [company, setCompany] = useState<CompanyProfile | null>(
    initialSession ? createCompanyProfileFromSession(initialSession) : null
  );

  useEffect(() => {
    if (!initialSession) return;

    setIsLoggedIn(true);
    setCompany((currentCompany) => {
      if (currentCompany?.userId === initialSession.userId) {
        return currentCompany;
      }

      return createCompanyProfileFromSession(initialSession);
    });
  }, [initialSession]);

  const login = (userData: CompanyProfile) => {
    setIsLoggedIn(true);
    setCompany(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCompany(null);
    // Clear user-specific data from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("omega_b2b_cart_items");
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, company, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);