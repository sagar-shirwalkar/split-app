(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var calc = new x_split.BalanceCalculator();
  return calc.getUserDashboard(gs.getUserID());
})(request, response);
