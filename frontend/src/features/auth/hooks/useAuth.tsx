"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import type { SessionUser } from "@/lib/session";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";

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
    firstName: session.firstName ?? "",       // ✅ if you added these to SessionUser
    middleName: session.middleName ?? "",
    lastName: session.lastName ?? "",
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

  const hasLoggedOutRef = useRef(false);
  const queryClient = useQueryClient();

  // ✅ Only react to actual user identity changes (not object reference changes)
  useEffect(() => {
    if (hasLoggedOutRef.current) return;

    if (!initialSession) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    setIsLoggedIn(true);
    setUser((currentUser) => {
      // ✅ Same user — keep existing reference, prevent re-render cascade
      if (currentUser?.userId === initialSession.userId) {
        return currentUser;
      }
      return createUserProfileFromSession(initialSession);
    });
  }, [initialSession?.userId]); // ✅ KEY FIX: depend on ID only

  const login = (userData: UserProfile) => {
    hasLoggedOutRef.current = false;
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      hasLoggedOutRef.current = true;
      await api.post("auth/logout").json();

      setIsLoggedIn(false);
      setUser(null);
      queryClient.clear();

      if (typeof window !== "undefined") {
        localStorage.removeItem("cart_items");
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggedIn(false);
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);