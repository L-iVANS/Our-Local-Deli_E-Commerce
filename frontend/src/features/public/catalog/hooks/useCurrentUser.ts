// src/hooks/useCurrentUser.ts
import { useState, useCallback, useEffect } from "react";
import { authService, type CurrentUser } from "@/features/public/catalog/services/catalog-service";
import type { SessionUser } from "@/lib/session";

export function useCurrentUser(initialUser: CurrentUser | SessionUser | null = null) {
  const [user, setUser] = useState<CurrentUser | null>(initialUser as CurrentUser | null);
  const [loading, setLoading] = useState(false);

  // ✅ Sync when initialUser changes
  useEffect(() => {
    setUser(initialUser as CurrentUser | null);
  }, [initialUser]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const me = await authService.getMe();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, refresh };
}