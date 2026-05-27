import { useCallback } from "react";

export function useAuth() {
  const user = {
    id: 1,
    openId: "local-admin",
    name: "Administrador",
    email: "admin@ecobairro.com",
    role: "admin",
  };

  const logout = useCallback(async () => {
    console.log("Logout local");
  }, []);

  return {
    user,
    loading: false,
    error: null,
    isAuthenticated: true,
    refresh: async () => {},
    logout,
  };
}