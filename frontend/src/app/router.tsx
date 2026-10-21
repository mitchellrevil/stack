// Keep routes thin. Each page and its components live with their feature.
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { AppShell } from "@/app/AppShell";
import { ChartDemoPage } from "@/features/chart-demo/ChartDemoPage";

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ChartDemoPage,
});
export const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute]),
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
