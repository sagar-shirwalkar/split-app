import "@servicenow/sdk/global";
import { Record } from "@servicenow/sdk/core";

/**
 * Navigator entry for the SplitApp.
 *
 * Adds a "SplitApp" link under the scoped application's menu that opens
 * the Lit UI at the UiPage URL. No workspace chrome, no list/detail pages,
 * no UI Builder involvement — the UiPage (`split_app.now.ts`) is a
 * self-contained shell that loads the Lit bundle from sys_ui_script.
 *
 * `link_type: "DIRECT"` + `query: "<ui_page_url>"` tells the navigator
 * to render this as a direct URL link.
 */
Record({
  $id: Now.ID["split-app-module"],
  table: "sys_app_module",
  data: {
    title: "SplitApp",
    active: true,
    order: 100,
    link_type: "DIRECT",
    query: "x_snc_split_split_app.do",
    application: Now.ref("sys_app_application", { title: "Split App" }),
  },
});
