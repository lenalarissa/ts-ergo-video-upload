import type { ReactNode } from "react";
import { clearAuth, refreshAccessToken, getUser } from "@/auth/auth.ts";
import { useMemo, useState, useCallback } from "react";
import AuthContext from "@/components/auth/AuthContext.tsx";
import type { User } from "eqmod-ts-userlogin";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => getUser());

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const result = await refreshAccessToken();

    if (result.invalidGrant) {
      logout();
      return null;
    }

    return result.accessToken;
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      getAccessToken,
    }),
    [user, logout, getAccessToken],
  );

  console.log("children", typeof children);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
