(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var groupId = request.pathParams.groupId;
  var utils = new x_split.SplitUtils();
  utils.requireMembership(groupId);

  var expenses = [];
  var expGr = new GlideRecord("x_split_expense");
  expGr.addQuery("group", groupId);
  expGr.orderBy("date");
  expGr.query();
  while (expGr.next()) {
    expenses.push({
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
      receipt_image: expGr.receipt_image.toString(),
    });
  }
  return expenses;
})(request, response);
