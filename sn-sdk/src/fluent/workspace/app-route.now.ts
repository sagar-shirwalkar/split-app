import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * URL route that resolves to the SplitApp home screen.
 *
 * `route_type: "home"` is the convention for the workspace's
 * landing route — it maps to the `default_route_type` set in
 * `app-config.now.ts`. The `fields` field is for parameterized
 * routes (e.g., `/now/split-app/group/:sys_id`); empty here
 * since we have a single screen.
 */
Record({
  $id: Now.ID["split-app-route"],
  table: "sys_ux_app_route",
  data: {
    name: "home",
    app_config: Now.ref("sys_ux_app_config", {
      sys_name: "split_app_workspace",
    }),
    route_type: "home",
    fields: "{}",
    optional_parameters: "{}",
    screen_type: Now.ref("sys_ux_screen_type", {
      name: "SplitApp Home",
    }),
  },
});
