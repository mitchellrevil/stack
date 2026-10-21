// MSAL owns token storage and renewal. Application code asks it for a token;
// it does not decode access tokens or store another copy in localStorage.
import { PublicClientApplication } from "@azure/msal-browser";
import type { AuthConfig } from "@/api/contracts";

export async function createEntraClient(config: AuthConfig) {
  const client = new PublicClientApplication({
    auth: {
      clientId: config.clientId,
      authority: `https://login.microsoftonline.com/${config.tenantId}`,
      redirectUri: window.location.origin,
    },
    cache: { cacheLocation: "sessionStorage" },
  });
  await client.initialize();
  const response = await client.handleRedirectPromise();
  client.setActiveAccount(
    response?.account ?? client.getAllAccounts()[0] ?? null,
  );
  return client;
}

export async function acquireApiToken(
  client: PublicClientApplication,
  scope: string,
) {
  const account = client.getActiveAccount();
  if (!account) {
    throw new Error("Sign in to continue.");
  }

  // Let the caller show a renewal error. Do not open surprise popups from a
  // background API request; the sign-in page owns interactive authentication.
  const response = await client.acquireTokenSilent({
    account,
    scopes: [scope],
  });
  return response.accessToken;
}
