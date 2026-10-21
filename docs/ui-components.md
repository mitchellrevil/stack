# UI components

Imported from the official shadcn New York v4 registry on 21 October 2026. All 61 UI entries available in that style are included, plus `hooks/use-mobile.ts`. This is the component set, not the separate example blocks or other design styles.

The source and upstream licence live in `frontend/src/components/ui`. Import aliases point to this app. The form resolver is pinned to 5.2.2 because the latest resolver had a conflicting optional peer dependency during setup. Recharts is 3.8.0, as specified by this registry.

The application build type-checks every component. ESLint and Prettier leave the imported component source and mobile hook in their upstream style.

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `attachment`, `avatar`, `badge`, `breadcrumb`, `bubble`, `button`, `button-group`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`, `dialog`, `direction`, `drawer`, `dropdown-menu`, `empty`, `field`, `form`, `hover-card`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `marker`, `menubar`, `message`, `message-scroller`, `native-select`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`.

To add or refresh components, run the shadcn CLI from `frontend`, review its changes and rerun the checks. Do not overwrite local component changes without reviewing them first.
