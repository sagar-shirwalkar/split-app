(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var groupId = request.pathParams.groupId;
  var utils = new x_snc_split.SplitUtils();
  if (!utils.isAdmin(groupId))
    throw new sn_ws_err.ServiceError(403, "Only group admins can delete groups.");

  // Cascade delete: settlements, shares, expenses, memberships, group
  var settGr = new GlideRecord("x_snc_split_settlement");
  settGr.addQuery("group", groupId);
  settGr.deleteMultiple();

  var expGr = new GlideRecord("x_snc_split_expense");
  expGr.addQuery("group", groupId);
  expGr.query();
  while (expGr.next()) {
    var shareGr = new GlideRecord("x_snc_split_share");
    shareGr.addQuery("expense", expGr.getUniqueValue());
    shareGr.deleteMultiple();
  }
  expGr = new GlideRecord("x_snc_split_expense");
  expGr.addQuery("group", groupId);
  expGr.deleteMultiple();

  var memGr = new GlideRecord("x_snc_split_membership");
  memGr.addQuery("group", groupId);
  memGr.deleteMultiple();

  var gr = new GlideRecord("x_snc_split_group");
  gr.get(groupId);
  gr.deleteRecord();

  return { status: "deleted" };
})(request, response);
