import { Table, ReferenceColumn, ChoiceColumn } from "@servicenow/sdk/core";

export const x_snc_split_membership = Table({
  $id: Now.ID["split-table-membership"],
  name: "x_snc_split_membership",
  label: "Membership",
  schema: {
    group: ReferenceColumn({
      label: "Group",
      referenceTable: "x_snc_split_group" as const,
      mandatory: true,
    }),
    user: ReferenceColumn({
      label: "User",
      referenceTable: "sys_user" as const,
      mandatory: true,
    }),
    role: ChoiceColumn({
      label: "Role",
      choices: { admin: "Admin", member: "Member" },
      default: "member",
      mandatory: true,
    }),
  },
});
