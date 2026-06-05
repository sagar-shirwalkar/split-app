import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * Macroponent: Split App Host
 *
 * Registers the Seismic wrapper (x-snc-split-app-host) as a macroponent
 * that can be placed on workspace pages.
 *
 * The actual component code lives in /seismic-wrapper/ and is deployed
 * separately via now-cli. This record is the "catalog entry" that tells
 * the platform the component exists and what assets it needs.
 */
Record("sys_ux_macroponent", {
  $id: Now.ID["split-app-macroponent"],
  name: "Split App Host",
  description:
    "Hosts the Lit-based SplitApp custom element inside a Now Experience workspace",

  // Must match createCustomElement() tag in seismic-wrapper/src/index.js
  tag: "x-snc-split-app-host",

  category: "custom",

  // No external props — the Lit app is self-contained
  props: JSON.stringify([]),
  slots: JSON.stringify([]),
  dispatched_events: JSON.stringify([]),
  handled_events: JSON.stringify([]),
  data_resources: JSON.stringify([]),

  composition: JSON.stringify({ elements: [] }),

  applicable_to: "workspace",
});

/**
 * Asset Dependency
 *
 * Tells the workspace: "when rendering the macroponent, also load
 * the Lit bundle." Without this, <split-app> custom element won't be
 * defined when the Seismic wrapper tries to mount it.
 *
 * References the sys_ux_lib_asset that the SDK auto-creates when it
 * processes the UiPage's <script src="split_app_main.jsx"> reference.
 * That asset serves the .jsdbx file.
 */
Record("sys_ux_macroponent_req_dep", {
  $id: Now.ID["split-app-macroponent-dep"],
  macroponent: Now.ref({
    table: "sys_ux_macroponent",
    id: Now.ID["split-app-macroponent"],
  }),
  // 'x_snc_split/split_app_main' asset — auto-created by UiPage build
  // ID from keys.ts: 344627bb454848e8bb94c8fd053f162c
  ux_lib_asset: Now.ref({
    table: "sys_ux_lib_asset",
    id: Now.ID["344627bb454848e8bb94c8fd053f162c"],
  }),
});
