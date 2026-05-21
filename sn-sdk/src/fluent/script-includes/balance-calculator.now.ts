import { ScriptInclude } from "@servicenow/sdk/core";

ScriptInclude({
  $id: Now.ID["split-si-balance-calculator"],
  name: "BalanceCalculator",
  active: true,
  clientCallable: false,
  accessibleFrom: "public",
  apiName: "x_2053373_split.BalanceCalculator",
  script: Now.include("../../server/script-includes/BalanceCalculator.server.js"),
});
