import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * The single screen in the SplitApp workspace.
 *
 * A screen is one URL's worth of UI. The `app_config` ref binds it
 * to the workspace, the `macroponent` ref binds it to the Seismic
 * component, and the `screen_type` ref binds it to the chrome style.
 *
 * `order: 100` makes this the only screen — it gets the root
 * `/now/split-app` URL automatically.
 *
 * `macroponent_config` is a JSON-encoded string that overrides the
 * macroponent's default props. Empty for now; the Lit element
 * fetches its own data.
 */
Record({
  $id: Now.ID["split-screen-home"],
  table: "sys_ux_screen",
  data: {
    name: "Home",
    order: 100,
    active: true,
    app_config: Now.ref("sys_ux_app_config", {
      sys_name: "split_app_workspace",
    }),
    description: "SplitApp home — the Lit UI mounts here",
    disable_auto_reflow: false,
    event_mappings: "{}",
    macroponent: Now.ref("sys_ux_macroponent", {
      name: "SplitApp Host",
    }),
    macroponent_config: "{}",
    required_translations: "{}",
    screen_type: Now.ref("sys_ux_screen_type", {
      name: "SplitApp Home",
    }),
  },
});
