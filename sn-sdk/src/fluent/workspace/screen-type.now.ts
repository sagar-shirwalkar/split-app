import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * Screen type for the SplitApp workspace.
 *
 * The screen_type table classifies a screen so the workspace shell
 * knows what chrome to render around it (header, footer, navigation).
 * `name` is the only required field — the OOTB types cover
 * "home", "record", "agent", "list", etc., but for a custom Seismic
 * host the type is just a label.
 */
Record({
  $id: Now.ID["split-screen-type"],
  table: "sys_ux_screen_type",
  data: {
    name: "SplitApp Home",
  },
});
