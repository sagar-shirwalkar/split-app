import type {} from "@servicenow/sdk/core";

declare global {
  namespace Now {
    interface IDs {
      "split-table-group": "split-table-group";
      "split-table-membership": "split-table-membership";
      "split-table-expense": "split-table-expense";
      "split-table-share": "split-table-share";
      "split-table-settlement": "split-table-settlement";
      "split-si-split-utils": "split-si-split-utils";
      "split-si-balance-calculator": "split-si-balance-calculator";
      "split-si-expense-manager": "split-si-expense-manager";
      "split-si-settlement-processor": "split-si-settlement-processor";
      "split-si-setup-app": "split-si-setup-app";
      "split-api": "split-api";
      "split-api-get-groups": "split-api-get-groups";
      "split-api-post-groups": "split-api-post-groups";
      "split-api-get-group": "split-api-get-group";
      "split-api-post-members": "split-api-post-members";
      "split-api-delete-member": "split-api-delete-member";
      "split-api-post-expenses": "split-api-post-expenses";
      "split-api-get-expenses": "split-api-get-expenses";
      "split-api-get-expense": "split-api-get-expense";
      "split-api-put-expense": "split-api-put-expense";
      "split-api-delete-expense": "split-api-delete-expense";
      "split-api-get-balances": "split-api-get-balances";
      "split-api-post-settlements": "split-api-post-settlements";
      "split-api-get-dashboard": "split-api-get-dashboard";
      "split-api-delete-group": "split-api-delete-group";
      "split-ui-page": "split-ui-page";
    }
  }
}
