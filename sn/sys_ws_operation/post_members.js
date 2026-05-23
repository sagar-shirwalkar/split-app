(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  // POST /groups/{groupId}/members
  var groupId = request.pathParams.groupId;
  var utils = new x_snc_split.SplitUtils();
  if (!utils.isAdmin(groupId))
    throw new sn_ws_err.ServiceError(403, "Only group admins can add members.");

  var body = request.body.data;
  var userId = body.user_sys_id;
  if (!userId && body.user_name) {
    var userGr = new GlideRecord("sys_user");
    userGr.addQuery("name", body.user_name);
    userGr.query();
    if (userGr.next()) userId = userGr.getUniqueValue();
  }
  var role = body.role || "member";

  if (!userId) throw new sn_ws_err.ServiceError(400, "User sys_id or user_name required.");

  var existing = new GlideRecord("x_snc_split_membership");
  existing.addQuery("group", groupId);
  existing.addQuery("user", userId);
  existing.query();
  if (existing.next())
    throw new sn_ws_err.ServiceError(400, "User is already a member.");

  var mem = new GlideRecord("x_snc_split_membership");
  mem.initialize();
  mem.group = groupId;
  mem.user = userId;
  mem.role = role;
  mem.insert();

  return { status: "added" };
})(request, response);
