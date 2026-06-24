"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { SessionUser } from "@/lib/session";
import { useQueryClient } from "@tanstack/react-query";

export interface UserProfile {
  userId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  emailAddress: string;
  address: string;
  phoneNumber: string;
  role: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout: () => Promise<void>;
}

function createUserProfileFromSession(session: SessionUser): UserProfile {
  return {
    userId: session.userId,
    firstName: "",
    middleName: "",
    lastName: "",
    fullName: session.fullName,
    emailAddress: session.emailAddress,
    address: "",
    phoneNumber: "",
    role: session.role,
  };
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: async () => {},
});

export function AuthProvider({
  children,
  initialSession = null,
}: {
  children: ReactNode;
  initialSession?: SessionUser | null;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(initialSession));
  const [user, setUser] = useState<UserProfile | null>(
    initialSession ? createUserProfileFromSession(initialSession) : null,
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!initialSession) return;

    setIsLoggedIn(true);
    setUser((currentUser) => {
      if (currentUser?.userId === initialSession.userId) {
        return currentUser;
      }

      return createUserProfileFromSession(initialSession);
    });
  }, [initialSession]);

  const login = (userData: UserProfile) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setIsLoggedIn(false);
      setUser(null);

      queryClient.clear();

      if (typeof window !== "undefined") {
        localStorage.removeItem("cart_items");
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
