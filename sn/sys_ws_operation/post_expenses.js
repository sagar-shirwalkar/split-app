(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var groupId = request.pathParams.groupId;
  var body = request.body.data;
  body.group = groupId;
  var mgr = new x_snc_split.ExpenseManager();
  var expId = mgr.createExpense(body);
  response.setStatus(201);
  return { sys_id: expId };
})(request, response);
