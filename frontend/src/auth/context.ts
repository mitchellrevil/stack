import { createContext, useContext } from "react";
import type { ApiClient } from "@/api/client";
import type { CurrentUser } from "@/api/contracts";

export type AuthSession = {
  enabled: boolean;
  user: CurrentUser;
  api: ApiClient;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthSession | null>(null);

export function useAuth() {
  const session = useContext(AuthContext);
  if (!session) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return session;
}
