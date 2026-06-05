import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * Workspace root: SplitApp Now Experience workspace.
 *
 * The app_config is the top-level wrapper that groups screens, routes,
 * and shell configuration under one namespace. The `base_url_path`
 * is what appears in the browser address bar after `/now`.
 *
 * `name` is the user-visible workspace title; `sys_name` is the
 * internal identifier. `default_route_type: "home"` makes the
 * workspace open directly on the first screen in `order`.
 */
Record({
  $id: Now.ID["split-app-config"],
  table: "sys_ux_app_config",
  data: {
    name: "SplitApp Workspace",
    sys_name: "split_app_workspace",
    active: true,
    disable_auto_reflow: false,
    encode_query_string: false,
    default_route_type: "home",
    description:
      "SplitApp — track shared expenses and settle up with friends. Lit UI hosted by a Seismic wrapper.",
    landing_path: "/now/split-app/home",
    base_url_path: "/now/split-app",
  },
});
