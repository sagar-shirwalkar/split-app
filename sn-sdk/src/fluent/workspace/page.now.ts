import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * Page Registry
 *
 * Registers the home/landing page within the workspace.
 * When a user navigates to /now/workspace/split-app, this page renders
 * the Split App Host macroponent (which in turn mounts <split-app>).
 */
Record("sys_ux_page_registry", {
  $id: Now.ID["split-app-workspace-page"],
  title: "Home",
  app: Now.ref({
    table: "sys_ux_app_config",
    id: Now.ID["split-app-workspace"],
  }),
  path: "",
  macroponent: Now.ref({
    table: "sys_ux_macroponent",
    id: Now.ID["split-app-macroponent"],
  }),
  order: 100,
  is_default: true,
  active: true,
});
