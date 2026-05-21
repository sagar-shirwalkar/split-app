(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var groupId = request.pathParams.groupId;
  var expenseId = request.pathParams.expenseId;
  var utils = new x_2053373_split.SplitUtils();
  utils.requireMembership(groupId);
  var mgr = new x_2053373_split.ExpenseManager();
  mgr.deleteExpense(expenseId);
  return { status: "deleted" };
})(request, response);
