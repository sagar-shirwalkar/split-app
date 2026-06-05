import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * Workspace App Config
 *
 * Defines the workspace shell — the top-level application frame that
 * provides navigation chrome, header, and hosts pages.
 *
 * Accessible at: /now/workspace/split-app (or /now/split-app depending on version)
 */
Record("sys_ux_app_config", {
  $id: Now.ID["split-app-workspace"],
  title: "SplitApp",
  description: "Expense splitting workspace",
  url_path: "split-app",
  app_shell_ui: "workspace",
  roles: "",
  active: true,
});
