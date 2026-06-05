import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * Macroponent definition: the x-snc-split-app-host Seismic element.
 *
 * A macroponent is a "Seismic component descriptor" — the JSON in
 * `composition` tells the workspace shell how to instantiate the
 * component. `comp: "x-snc-split-app-host"` is the custom-element
 * tag name registered by the Seismic build at
 * `seismic-wrapper/src/x-snc-split-app-host/index.tsx`.
 *
 * `layout` is the chrome around the component (header, footer,
 * breadcrumbs). For a fullscreen Lit subtree, we use "page_center"
 * (an OOTB layout) so the Seismic shell draws only the top app bar
 * and the Lit element fills the rest.
 *
 * The `props` field is a JSON-encoded string of default prop values
 * (matches the React Pattern B's props object).
 */
Record({
  $id: Now.ID["split-macroponent-host"],
  table: "sys_ux_macroponent",
  data: {
    name: "SplitApp Host",
    category: "x_snc_split",
    layout: "page_center",
    composition: JSON.stringify({
      comp: "x-snc-split-app-host",
      props: {},
    }),
    props: "{}",
    schema_version: "1.0.0",
    internal_event_mappings: "{}",
  },
});
