import { trpc } from "@/lib/trpc";
import { useCallback, useMemo } from "react";

export function useAuth() {
  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(async () => {
    console.log("Logout desabilitado no modo sem autenticação");
  }, []);

  const state = useMemo(() => {
    return {
      user: meQuery.data ?? {
        id: 1,
        name: "Usuário EcoBairro",
        email: "usuario@ecobairo.com.br",
        role: "admin",
      },
      loading: meQuery.isLoading,
      error: null,
      isAuthenticated: true,
    };
  }, [meQuery.data, meQuery.isLoading]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
