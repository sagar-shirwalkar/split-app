(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var groupId = request.pathParams.groupId;
  var expenseId = request.pathParams.expenseId;
  var body = request.body.data;
  var mgr = new x_2053373_split.ExpenseManager();
  mgr.updateExpense(expenseId, body);
  return { sys_id: expenseId };
})(request, response);
