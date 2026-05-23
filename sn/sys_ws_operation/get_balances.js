(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var groupId = request.pathParams.groupId;
  var utils = new x_snc_split.SplitUtils();
  utils.requireMembership(groupId);

  var calc = new x_snc_split.BalanceCalculator();
  var balances = calc.getGroupBalances(groupId);
  return balances;
})(request, response);
