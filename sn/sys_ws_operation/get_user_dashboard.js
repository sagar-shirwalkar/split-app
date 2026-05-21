(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var calc = new x_2053373_split.BalanceCalculator();
  var dash = calc.getUserDashboard(gs.getUserID());
  dash.current_user = gs.getUserID();
  return dash;
})(request, response);
