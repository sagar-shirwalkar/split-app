import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * Page Registry
 *
 * Registers the home/landing page within the workspace.
 * When a user navigates to /now/workspace/split-app, this page renders
 * the Split App Host macroponent (which in turn mounts <split-app>).
 */
Record({
  $id: Now.ID["split-app-workspace-page"],
  table: "sys_ux_page_registry",
  data: {
    title: "Home",
    app: Now.ref("sys_ux_app_config", Now.ID["split-app-workspace"]),
    path: "",
    macroponent: Now.ref("sys_ux_macroponent", Now.ID["split-app-macroponent"]),
    order: 100,
    is_default: true,
    active: true,
  },
});
