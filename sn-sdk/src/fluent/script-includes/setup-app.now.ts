import { ScriptInclude } from "@servicenow/sdk/core";

ScriptInclude({
  $id: Now.ID["split-si-setup-app"],
  name: "SetupApp",
  active: true,
  clientCallable: false,
  accessibleFrom: "package_private",
  apiName: "x_snc_split.SetupApp",
  script: Now.include("../../server/script-includes/SetupApp.server.js"),
});
