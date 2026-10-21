// Demo mode and Entra mode share the same session shape. Features do not need
// to know about MSAL or repeat the decision about whether auth is enabled.
import { useMemo, useState, type ReactNode } from "react";
import { MsalProvider, useMsal } from "@azure/msal-react";
import {
  InteractionStatus,
  type PublicClientApplication,
} from "@azure/msal-browser";
import { useQuery } from "@tanstack/react-query";
import { createApiClient } from "@/api/client";
import { currentUserSchema, type AuthConfig } from "@/api/contracts";
import { acquireApiToken } from "@/auth/entra";
import { AuthContext } from "@/auth/context";
import { SignInPage } from "@/features/auth/components/SignInPage";

const demoApi = createApiClient(async () => null);

export function AuthProvider({
  config,
  client,
  children,
}: {
  config: AuthConfig;
  client: PublicClientApplication | null;
  children: ReactNode;
}) {
  if (!config.enabled) {
    return (
      <AuthContext.Provider
        value={{
          enabled: false,
          user: { name: "Demo user", permissions: [] },
          api: demoApi,
          signOut: async () => {},
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  if (!client) {
    throw new Error("Entra is enabled but its client is missing");
  }

  return (
    <MsalProvider instance={client}>
      <EntraSession config={config} client={client}>
        {children}
      </EntraSession>
    </MsalProvider>
  );
}

function EntraSession({
  config,
  client,
  children,
}: {
  config: AuthConfig;
  client: PublicClientApplication;
  children: ReactNode;
}) {
  const { inProgress } = useMsal();
  const [signInError, setSignInError] = useState("");
  // Use the same account as token acquisition, even with several cached logins.
  const accountId = client.getActiveAccount()?.homeAccountId;
  const api = useMemo(
    () => createApiClient(() => acquireApiToken(client, config.scope)),
    [client, config.scope],
  );
  const currentUserQuery = useQuery({
    queryKey: ["current-user", accountId],
    queryFn: ({ signal }) => api.get("/auth/me", currentUserSchema, signal),
    enabled: Boolean(accountId) && inProgress === InteractionStatus.None,
    retry: false,
  });

  async function signIn() {
    try {
      await client.loginRedirect({ scopes: [config.scope] });
    } catch {
      setSignInError("Sign-in could not start. Please try again.");
    }
  }

  if (inProgress !== InteractionStatus.None) {
    return (
      <p role="status" className="p-12">
        Completing sign-in…
      </p>
    );
  }

  if (!accountId || currentUserQuery.isError) {
    return (
      <SignInPage
        onSignIn={signIn}
        error={signInError || currentUserQuery.error?.message}
      />
    );
  }

  if (!currentUserQuery.data) {
    return (
      <p role="status" className="p-12">
        Checking your access…
      </p>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        enabled: true,
        user: currentUserQuery.data,
        api,
        signOut: () => client.logoutRedirect(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
