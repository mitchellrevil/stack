// The backend owns the on/off switch. A failed request must not imply demo mode.
import { createApiClient } from "@/api/client";
import { authConfigSchema } from "@/api/contracts";

export function loadAuthConfig() {
  return createApiClient(async () => null).get(
    "/auth/config",
    authConfigSchema,
  );
}
