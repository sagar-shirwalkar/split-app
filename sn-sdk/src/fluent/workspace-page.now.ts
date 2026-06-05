import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * UX App Shell Configuration
 *
 * Table: sys_ux_app_config
 * Purpose: Defines a workspace application — the top-level shell that
 *          provides navigation, header, sidebar, and hosts pages.
 *
 * After deployment, accessible at:
 *   /now/workspace/split-app
 */
Record("sys_ux_app_config", {
  $id: Now.ID["split-app-workspace"],
  title: "SplitApp",
  description: "Expense splitting workspace powered by Lit components",

  // URL path segment: /now/workspace/{url_path}
  url_path: "split-app",

  // App shell variant — 'workspace' gives you the standard chrome
  // (sidebar nav, header with user menu, breadcrumbs)
  app_shell_ui: "workspace",

  // Roles: empty means all authenticated users can access
  roles: "",

  // Active
  active: true,
});

/**
 * Page Registry Entry
 *
 * Table: sys_ux_page_registry
 * Purpose: Registers a page within the workspace. This is the "screen"
 *          that renders when a user navigates to the workspace.
 *
 * A workspace can have multiple pages (e.g., Dashboard, Settings).
 * We only need one — the main Split App view.
 */
Record("sys_ux_page_registry", {
  $id: Now.ID["split-app-page"],
  title: "Home",

  // The workspace this page belongs to
  app: Now.ref({
    table: "sys_ux_app_config",
    id: Now.ID["split-app-workspace"],
  }),

  // Route path within the workspace: /now/workspace/split-app/{path}
  // Empty = this is the landing/home page
  path: "",

  // The macroponent that renders on this page
  macroponent: Now.ref({
    table: "sys_ux_macroponent",
    id: Now.ID["split-app-macroponent"],
  }),

  // Page order in sidebar navigation
  order: 100,

  // Sidebar navigation entry
  nav_label: "SplitApp",
  nav_icon: "currency-outline",

  // This is the default/landing page for the workspace
  is_default: true,

  active: true,
});

/**
 * (Optional) Additional page for settings or admin
 * Uncomment if you want a second page in the workspace later.
 */
// Record('sys_ux_page_registry', {
//     $id: Now.ID['split-app-settings-page'],
//     title: 'Settings',
//     app: Now.ref({ table: 'sys_ux_app_config', id: Now.ID['split-app-workspace'] }),
//     path: 'settings',
//     macroponent: Now.ref({ table: 'sys_ux_macroponent', id: Now.ID['...'] }),
//     order: 200,
//     nav_label: 'Settings',
//     nav_icon: 'gear-outline',
//     is_default: false,
//     active: true,
// })
