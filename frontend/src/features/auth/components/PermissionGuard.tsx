import type { ReactNode } from "react";
import { useAuth } from "@/auth/context";
import { hasPermission } from "@/auth/permissions";

export function PermissionGuard({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { enabled, user } = useAuth();

  // This controls the page people see. The API checks access separately.
  if (!hasPermission(enabled, user.permissions, permission)) {
    return (
      <div role="alert" className="rounded-xl border p-8">
        You need the <strong>{permission}</strong> permission to see this page.
        Ask your app administrator for access.
      </div>
    );
  }

  return children;
}
