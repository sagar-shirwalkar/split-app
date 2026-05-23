(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  // DELETE /groups/{groupId}/members/{userSysId}
  var groupId = request.pathParams.groupId;
  var userId = request.pathParams.userSysId;
  var utils = new x_snc_split.SplitUtils();
  if (!utils.isAdmin(groupId))
    throw new sn_ws_err.ServiceError(
      403,
      "Only group admins can remove members.",
    );

  var calc = new x_snc_split.BalanceCalculator();
  var balances = calc.getGroupBalances(groupId);
  for (var i = 0; i < balances.length; i++) {
    var b = balances[i];
    if (b.from_user === userId || b.to_user === userId) {
      throw new sn_ws_err.ServiceError(
        400,
        "Cannot remove a member with outstanding balances.",
      );
    }
  }

  var mem = new GlideRecord("x_snc_split_membership");
  mem.addQuery("group", groupId);
  mem.addQuery("user", userId);
  mem.query();
  if (mem.next()) {
    mem.deleteRecord();
  }

  return { status: "removed" };
})(request, response);
