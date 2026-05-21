(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  // GET /groups/{groupId}
  var groupId = request.pathParams.groupId;
  var utils = new x_2053373_split.SplitUtils();
  utils.requireMembership(groupId);

  var gr = new GlideRecord("x_2053373_split_group");
  if (!gr.get(groupId))
    throw new sn_ws_err.ServiceError(404, "Group not found.");

  var members = [];
  var memGr = new GlideRecord("x_2053373_split_membership");
  memGr.addQuery("group", groupId);
  memGr.query();
  while (memGr.next()) {
    members.push({
      sys_id: memGr.user.toString(),
      name: memGr.user.getDisplayValue(),
      role: memGr.role.toString(),
    });
  }

  return {
    sys_id: gr.getUniqueValue(),
    name: gr.name.toString(),
    description: gr.description.toString(),
    base_currency: gr.base_currency.toString(),
    members: members,
  };
})(request, response);
