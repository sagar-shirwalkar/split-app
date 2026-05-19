var ExpenseManager = Class.create();
ExpenseManager.prototype = {
  initialize: function () {},

  createExpense: function (expenseData) {
    var utils = new SplitUtils();
    utils.requireMembership(expenseData.group);

    var expGr = new GlideRecord("x_split_expense");
    expGr.initialize();
    expGr.group = expenseData.group;
    expGr.description = expenseData.description;
    expGr.amount = expenseData.amount;
    expGr.date = expenseData.date || new GlideDateTime().getDate();
    expGr.category = expenseData.category || "Other";
    expGr.payer = expenseData.payer || gs.getUserID();
    expGr.split_type = expenseData.split_type;
    expGr.notes = expenseData.notes || "";
    var expSysId = expGr.insert();

    var shares;
    if (expenseData.split_type === "equal") {
      var memGr = new GlideRecord("x_split_membership");
      memGr.addQuery("group", expenseData.group);
      memGr.query();
      var members = [];
      while (memGr.next()) {
        members.push(memGr.user.toString());
      }
      if (members.length === 0) throw new Error("Group has no members.");
      var perShare = parseFloat(
        (expenseData.amount / members.length).toFixed(2),
      );
      var remainder = expenseData.amount - perShare * members.length;
      shares = members.map(function (userSysId, index) {
        var amount = perShare;
        if (index === 0) amount += remainder;
        return { user: userSysId, amount: amount };
      });
    } else {
      shares = expenseData.shares;
    }

    utils.validateShares(expenseData.amount, shares);

    for (var i = 0; i < shares.length; i++) {
      var shGr = new GlideRecord("x_split_share");
      shGr.initialize();
      shGr.expense = expSysId;
      shGr.user = shares[i].user;
      shGr.amount = shares[i].amount;
      if (shares[i].percentage !== undefined)
        shGr.percentage = shares[i].percentage;
      if (shares[i].shares !== undefined) shGr.shares = shares[i].shares;
      shGr.insert();
    }

    return expSysId;
  },

  deleteExpense: function (expenseSysId) {
    var expGr = new GlideRecord("x_split_expense");
    if (!expGr.get(expenseSysId)) throw new Error("Expense not found.");

    var utils = new SplitUtils();
    utils.requireMembership(expGr.group.toString());

    if (
      expGr.payer.toString() !== gs.getUserID() &&
      !utils.isAdmin(expGr.group.toString())
    ) {
      throw new Error(
        "Only the payer or a group admin can delete this expense.",
      );
    }

    var shareGr = new GlideRecord("x_split_share");
    shareGr.addQuery("expense", expenseSysId);
    shareGr.addQuery("settled", true);
    shareGr.query();
    if (shareGr.next()) {
      throw new Error("Cannot delete an expense that has settled shares.");
    }

    var delShares = new GlideRecord("x_split_share");
    delShares.addQuery("expense", expenseSysId);
    delShares.query();
    while (delShares.next()) {
      delShares.deleteRecord();
    }
    expGr.deleteRecord();
  },

  type: "ExpenseManager",
};
