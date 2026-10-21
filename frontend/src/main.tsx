import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { loadAuthConfig } from "@/auth/config";
import { createEntraClient } from "@/auth/entra";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { router } from "@/app/router";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
const queryClient = new QueryClient();

async function start() {
  const config = await loadAuthConfig();
  const client = config.enabled ? await createEntraClient(config) : null;
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider config={config} client={client}>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

start().catch(() => {
  // Configuration failures must stay visible, never become unauthenticated mode.
  root.render(
    <main className="mx-auto max-w-lg p-12">
      <h1 className="text-2xl font-semibold">The app could not start.</h1>
      <p role="alert" className="my-4">
        Check the backend is running and the Entra settings are correct, then
        reload this page.
      </p>
      <button onClick={() => window.location.reload()}>Try again</button>
    </main>,
  );
});
