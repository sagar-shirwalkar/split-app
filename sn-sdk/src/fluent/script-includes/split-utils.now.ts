import { ScriptInclude } from "@servicenow/sdk/core";

ScriptInclude({
  $id: Now.ID["split-si-split-utils"],
  name: "SplitUtils",
  active: true,
  clientCallable: false,
  accessibleFrom: "public",
  apiName: "x_2053373_split.SplitUtils",
  script: Now.include("../../server/script-includes/SplitUtils.server.js"),
});
