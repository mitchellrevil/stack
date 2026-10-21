// Validate responses at the network boundary. Components can then rely on them.
import { z } from "zod";

export const authConfigSchema = z
  .object({
    enabled: z.boolean(),
    clientId: z.string(),
    tenantId: z.string(),
    scope: z.string(),
  })
  .refine(
    (config) => config.enabled === Boolean(config.clientId),
    "Inconsistent auth configuration",
  );
export type AuthConfig = z.infer<typeof authConfigSchema>;

export const currentUserSchema = z.object({
  name: z.string(),
  permissions: z.array(z.string()),
});
export type CurrentUser = z.infer<typeof currentUserSchema>;
