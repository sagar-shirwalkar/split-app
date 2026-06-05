import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * Macroponent: Split App Host
 *
 * Registers the Seismic wrapper as a placeable unit in workspace pages.
 * The Seismic component (x-snc-split-app-host) loads the Lit bundle
 * at runtime via /api/now/ux/asset/x_snc_split/split_app_main —
 * no platform-level asset dependency needed.
 */
Record({
  $id: Now.ID["split-app-macroponent"],
  table: "sys_ux_macroponent",
  data: {
    name: "Split App Host",
    description:
      "Hosts the Lit-based SplitApp custom element inside a Now Experience workspace",
    tag: "x-snc-split-app-host",
    category: "custom",
    props: JSON.stringify([]),
    slots: JSON.stringify([]),
    dispatched_events: JSON.stringify([]),
    handled_events: JSON.stringify([]),
    data_resources: JSON.stringify([]),
    composition: JSON.stringify({ elements: [] }),
    applicable_to: "workspace",
  },
});

// NOTE: No sys_ux_macroponent_req_dep record.
// The Seismic component handles bundle loading itself at runtime:
//   script.src = '/api/now/ux/asset/x_snc_split/split_app_main'
// This avoids coupling to an auto-generated sys_ux_lib_asset sys_id
// that varies per instance/build.
