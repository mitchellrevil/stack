import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/auth/context";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  const { enabled, signOut } = useAuth();

  return (
    <div className="mx-auto min-h-screen max-w-[1440px] px-6 py-8 lg:px-12">
      {enabled && (
        <div className="mb-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => void signOut()}>
            <LogOut size={16} /> Sign out
          </Button>
        </div>
      )}
      {children}
    </div>
  );
}
