(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var body = request.body.data;
  var name = body.name;
  var description = body.description || "";
  var currency = body.base_currency || "USD";

  if (!name) {
    throw new sn_ws_err.ServiceError(400, "Group name is required.");
  }

  var gr = new GlideRecord("x_snc_split_group");
  gr.initialize();
  gr.name = name;
  gr.description = description;
  gr.base_currency = currency;
  gr.created_by = gs.getUserID();
  var groupId = gr.insert();

  var mem = new GlideRecord("x_snc_split_membership");
  mem.initialize();
  mem.group = groupId;
  mem.user = gs.getUserID();
  mem.role = "admin";
  mem.insert();

  response.setStatus(201);
  return { sys_id: groupId, name: name };
})(request, response);
