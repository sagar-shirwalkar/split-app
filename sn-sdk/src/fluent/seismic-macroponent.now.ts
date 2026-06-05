import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * Macroponent Definition
 *
 * Table: sys_ux_macroponent
 * Purpose: Registers the Seismic wrapper as a placeable unit in workspaces/UI Builder.
 *
 * This does NOT contain the component code — that lives in seismic-wrapper/
 * and is deployed separately via now-cli. This record tells the platform:
 *   "There exists a macroponent called 'Split App Host' backed by the
 *    custom element <x-snc-split-app-host>"
 */
Record("sys_ux_macroponent", {
  $id: Now.ID["split-app-macroponent"],

  // Display metadata
  name: "Split App Host",
  description:
    "Hosts the Lit-based SplitApp inside a Now Experience workspace. Loads the compiled Lit bundle and mounts <split-app> into the DOM.",

  // The custom element tag from seismic-wrapper/now-ui.json
  // Must exactly match what createCustomElement() registers
  tag: "x-snc-split-app-host",

  // Categorization for UI Builder palette
  category: "custom",
  subcategory: "content",

  // Schema: defines what properties/slots the macroponent exposes
  // Since the Lit app is self-contained, we expose nothing
  props: JSON.stringify([]),
  slots: JSON.stringify([]),
  dispatched_events: JSON.stringify([]),
  handled_events: JSON.stringify([]),

  // Data broker config — none needed, Lit app fetches its own data
  data_resources: JSON.stringify([]),

  // Composition: child macroponents (none — this is a leaf)
  composition: JSON.stringify({
    elements: [],
  }),

  // Applies to these experience types
  applicable_to: "workspace",
});

/**
 * Asset Dependency
 *
 * Table: sys_ux_macroponent_req_dep
 * Purpose: Tells the platform "when rendering this macroponent, also load
 *          the Lit bundle asset." Without this, the <split-app> custom element
 *          would not be defined when the wrapper tries to create it.
 */
Record("sys_ux_macroponent_req_dep", {
  $id: Now.ID["split-app-macroponent-dep"],
  macroponent: Now.ref({
    table: "sys_ux_macroponent",
    id: Now.ID["split-app-macroponent"],
  }),
  // This references the sys_ux_lib_asset that holds split_app_main.jsx
  // The ID comes from your keys.ts (already exists from UI Page deployment)
  ux_lib_asset: Now.ref({
    table: "sys_ux_lib_asset",
    id: Now.ID["344627bb454848e8bb94c8fd053f162c"], // 'x_snc_split/split_app_main'
  }),
});
