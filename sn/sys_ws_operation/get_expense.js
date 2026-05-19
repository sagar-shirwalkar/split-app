(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var groupId = request.pathParams.groupId;
  var expenseId = request.pathParams.expenseId;
  var utils = new x_split.SplitUtils();
  utils.requireMembership(groupId);

  var expGr = new GlideRecord("x_split_expense");
  if (!expGr.get(expenseId) || expGr.group.toString() !== groupId) {
    throw new sn_ws_err.ServiceError(404, "Expense not found.");
  }

  var shares = [];
  var shGr = new GlideRecord("x_split_share");
  shGr.addQuery("expense", expenseId);
  shGr.query();
  while (shGr.next()) {
    shares.push({
      sys_id: shGr.getUniqueValue(),
      user: {
        sys_id: shGr.user.toString(),
        name: shGr.user.getDisplayValue(),
      },
      amount: shGr.amount.toString(),
      settled_amount: shGr.settled_amount.toString(),
      settled: shGr.settled.toString(),
    });
  }

  return {
    sys_id: expGr.getUniqueValue(),
    description: expGr.description.toString(),
    amount: expGr.amount.toString(),
    date: expGr.date.toString(),
    category: expGr.category.toString(),
    payer: {
      sys_id: expGr.payer.toString(),
      name: expGr.payer.getDisplayValue(),
    },
    split_type: expGr.split_type.toString(),
    notes: expGr.notes.toString(),
    shares: shares,
  };
})(request, response);
